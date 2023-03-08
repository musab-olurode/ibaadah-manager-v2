import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  Pressable,
  Image,
  StyleProp,
} from 'react-native';
import {ProfileNavigatorParamList} from '../navigators/ProfileNavigator';
import {GlobalColors, globalStyles, normalizeFont} from '../styles/global';
import CalendarPicker from 'react-native-calendar-picker';
import ChevronLeftIcon from '../assets/icons/chevron-left.svg';
import ChevronRightIcon from '../assets/icons/chevron-right.svg';
import CollapsedCalender from '../components/CollapsedCalender';
import WeeklyActivitiesIconImg from '../assets/icons/weekly-activities.png';
import MonthlyActivitiesIconImg from '../assets/icons/monthly-activities.png';
import {
  ActivityStorage,
  FilterType,
  GroupedActivityEvaluation,
  SubFilterType,
} from '../types/global';
import {Select} from 'native-base';
import FilterIconImg from '../assets/icons/filter.svg';
import Chip from '../components/Chip';
import {
  getActivitiesForCurrentWeek,
  getActivitiesForLastWeek,
  groupActivities,
} from '../utils/activities';
import ActivityItem from '../components/ActivityItem';
import TotalActivityBreakdown from '../components/TotalActivityBreakdown';
import {Moment} from 'moment';
import {useIsFocused} from '@react-navigation/native';

const PeriodicEvaluation = ({
  route,
}: NativeStackScreenProps<ProfileNavigatorParamList>) => {
  const {filter, activity: activityTitle} =
    route.params as ProfileNavigatorParamList['PeriodicEvaluation'];
  const [calenderDisplay, setCalendarDisplay] = useState<'weekly' | 'monthly'>(
    'weekly',
  );
  const [subFilter, setSubFilter] = useState(SubFilterType.INDIVIDUAL);
  const [selectedChip, setSelectedChip] = useState('');
  const [selectedActivityGroup, setSelectedActivityGroup] =
    useState<GroupedActivityEvaluation>();
  const [activitiesForTheWeek, setActivitiesForTheWeek] = useState<
    ActivityStorage[]
  >([]);
  const [weeklyActivitiesEvaluation, setWeeklyActivitiesEvaluation] = useState<
    GroupedActivityEvaluation[]
  >([]);

  const isFocused = useIsFocused();

  const handleOnSelectSubFilter = (value: string) => {
    setSubFilter(value as SubFilterType);
  };

  const onDateChange = (date: Moment, type: 'START_DATE' | 'END_DATE') => {
    console.log(date, type);
  };

  const customDayHeaderStylesCallback = (): {
    style: ViewStyle;
    textStyle: TextStyle;
  } => {
    return {
      style: {
        borderRadius: 12,
      },
      textStyle: {
        color: GlobalColors['primary.900'],
        fontSize: normalizeFont(14),
        fontWeight: '400',
      },
    };
  };

  const customDatesStylesCallback = (): {
    containerStyle: ViewStyle;
    style: ViewStyle;
    textStyle: TextStyle;
    allowDisabled: Boolean;
  } => {
    return {
      style: {},
      textStyle: {
        color: GlobalColors['primary.900'],
        fontSize: normalizeFont(16),
        fontWeight: '500',
      },
      containerStyle: {},
      allowDisabled: false,
    };
  };

  const toggleCalenderDisplay = () => {
    if (calenderDisplay === 'weekly') {
      setCalendarDisplay('monthly');
    } else {
      setCalendarDisplay('weekly');
    }
  };

  const handleCalenderDateChange = (date: Date) => {
    const activitiesForTheDay = activitiesForTheWeek.find(
      activity =>
        new Date(activity.date).toLocaleDateString() ===
        new Date(date).toLocaleDateString(),
    );
    const groupedActivities = groupActivities(activitiesForTheDay?.data || []);
    setSelectedChip(groupedActivities[0]?.title || '');
    setSelectedActivityGroup(groupedActivities[0]);
    setWeeklyActivitiesEvaluation(groupedActivities);
  };

  const handleActivityGroupSelection = (activityGroup: string) => {
    const selectedGroup = weeklyActivitiesEvaluation.find(
      activity => activity.title === activityGroup,
    );
    setSelectedActivityGroup(selectedGroup);
    setSelectedChip(activityGroup);
  };

  const totalActivitiesBreakdown = useMemo(() => {
    let progress = 0;
    let totalBreakdown: {name: string; completed: number; total: number}[] = [];
    if (selectedActivityGroup) {
      const totalActivitiesForGroup = activitiesForTheWeek.map(activity => {
        const filteredActivities = activity.data.filter(
          act => act.title === selectedActivityGroup.title,
        );
        return {...activity, data: filteredActivities};
      });

      totalBreakdown = totalActivitiesForGroup.reduce((acc, activity) => {
        activity.data.map(act => {
          const found = acc.find(item => item.name === act.activity);
          if (found) {
            found.completed = act.completed
              ? found.completed + 1
              : found.completed;
          } else {
            acc.push({
              name: act.activity,
              completed: 0,
              total: filter === FilterType.MONTHLY ? 30 : 7,
            });
          }
        });
        return acc;
      }, [] as {name: string; completed: number; total: number}[]);

      const total = filter === FilterType.MONTHLY ? 30 : 7;
      const totalCompleted = totalBreakdown.reduce((acc, item) => {
        acc = acc + item.completed;
        return acc;
      }, 0);
      progress = totalCompleted / (total * totalBreakdown.length);
    }

    return {progress, totalBreakdown};
  }, [selectedActivityGroup, activitiesForTheWeek]);

  useEffect(() => {
    const getEvaluation = async () => {
      if (filter === FilterType.THIS_WEEK) {
        const activitiesForCurrentWeek = await getActivitiesForCurrentWeek(
          activityTitle,
        );
        console.log('act------', activitiesForCurrentWeek);
        setActivitiesForTheWeek(activitiesForCurrentWeek);
        const activitiesForTheDay = activitiesForCurrentWeek.find(
          activity =>
            new Date(activity.date).toLocaleDateString() ===
            new Date().toLocaleDateString(),
        );
        const groupedActivities = groupActivities(activitiesForTheDay!.data);
        setSelectedChip(groupedActivities[0].title);
        setSelectedActivityGroup(groupedActivities[0]);
        setWeeklyActivitiesEvaluation(groupedActivities);
      } else if (filter === FilterType.LAST_WEEK) {
        const activitiesForCurrentWeek = await getActivitiesForLastWeek(
          activityTitle,
        );
        setActivitiesForTheWeek(activitiesForCurrentWeek);
        const sortedActivities = activitiesForCurrentWeek.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        if (activitiesForCurrentWeek.length > 0) {
          const activitiesForTheFirstDayInTheWeek = sortedActivities.find(
            activity =>
              new Date(activity.date).toLocaleDateString() ===
              new Date(sortedActivities[0].date).toLocaleDateString(),
          );
          const groupedActivities = groupActivities(
            activitiesForTheFirstDayInTheWeek!.data,
          );
          setSelectedChip(groupedActivities[0].title);
          setSelectedActivityGroup(groupedActivities[0]);
          setWeeklyActivitiesEvaluation(groupedActivities);
        }
      }
    };
    getEvaluation();
  }, [isFocused]);

  return (
    <ScrollView style={globalStyles.container}>
      {filter === FilterType.MONTHLY && (
        <View style={styles.toggleCalendarDisplay}>
          <Pressable onPress={toggleCalenderDisplay}>
            {calenderDisplay === 'weekly' ? (
              <Image source={MonthlyActivitiesIconImg} />
            ) : (
              <Image source={WeeklyActivitiesIconImg} />
            )}
          </Pressable>
        </View>
      )}
      {calenderDisplay === 'weekly' ? (
        <CollapsedCalender
          type={
            filter === FilterType.LAST_WEEK
              ? FilterType.LAST_WEEK
              : FilterType.THIS_WEEK
          }
          onDateChange={handleCalenderDateChange}
        />
      ) : (
        <View style={styles.calenderContainer}>
          <CalendarPicker
            previousComponent={<ChevronLeftIcon />}
            nextComponent={<ChevronRightIcon />}
            dayLabelsWrapper={styles.dayLabelsWrapper}
            headerWrapperStyle={styles.headerWrapper}
            customDayHeaderStyles={customDayHeaderStylesCallback}
            monthTitleStyle={styles.yearMonthTitle}
            yearTitleStyle={styles.yearMonthTitle}
            todayBackgroundColor={GlobalColors.primary}
            selectedDayColor={GlobalColors.primary}
            todayTextStyle={styles.yearMonthTitle}
            customDatesStyles={customDatesStylesCallback}
            allowRangeSelection
            selectedDayTextStyle={styles.yearMonthTitle}
            onDateChange={onDateChange}
          />
        </View>
      )}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderTitle}></Text>
        <View style={styles.selectContainer}>
          <Select
            variant="unstyled"
            style={styles.filter as StyleProp<ViewStyle>}
            dropdownIcon={<FilterIconImg style={styles.filterIcon} />}
            selectedValue={subFilter}
            accessibilityLabel="Choose Filter"
            placeholder="Choose Filter"
            onValueChange={handleOnSelectSubFilter}>
            <Select.Item label="Individual" value={SubFilterType.INDIVIDUAL} />
            <Select.Item label="Total" value={SubFilterType.TOTAL} />
          </Select>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chips}>
        {weeklyActivitiesEvaluation.map((activity, index) => (
          <Chip
            key={index}
            title={activity.title}
            style={styles.chip}
            active={selectedChip === activity.title}
            onPress={() => handleActivityGroupSelection(activity.title)}
          />
        ))}
      </ScrollView>

      <View style={styles.breakdown}>
        {subFilter === SubFilterType.TOTAL ? (
          <TotalActivityBreakdown
            progress={totalActivitiesBreakdown.progress}
            style={styles.breakdownItem}
            activities={totalActivitiesBreakdown.totalBreakdown}
          />
        ) : (
          <View>
            {selectedActivityGroup?.content.map((content, index) => (
              <ActivityItem
                key={`breakdown-${index}`}
                activity={content.activity}
                defaultCheckboxState={content.completed}
                hideStartIcon={true}
                showEndIcon={true}
                endIcon="checkbox"
                disableCheckbox
                style={styles.breakdownItem}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  toggleCalendarDisplay: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  calenderContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  dayLabelsWrapper: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  headerWrapper: {
    borderTopRightRadius: 8,
    borderRadius: 8,
    backgroundColor: GlobalColors.primary,
    paddingHorizontal: 40,
    paddingTop: 18,
    paddingBottom: 18,
  },
  yearMonthTitle: {
    color: 'white',
  },
  sectionHeader: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderTitle: {
    ...globalStyles.text,
    fontWeight: '500',
    fontSize: normalizeFont(22),
  },
  selectContainer: {
    backgroundColor: 'white',
    width: 139,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  filter: {
    ...globalStyles.text,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 4,
  },
  filterIcon: {
    marginRight: 16,
  },
  chips: {
    marginTop: 24,
  },
  chip: {
    marginRight: 8,
  },
  breakdown: {
    marginVertical: 40,
  },
  breakdownItem: {
    marginBottom: 16,
  },
});

export default PeriodicEvaluation;
