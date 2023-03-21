import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
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
import {
  GlobalColors,
  globalFonts,
  globalStyles,
  normalizeFont,
} from '../styles/global';
import CalendarPicker from 'react-native-calendar-picker';
import ChevronLeftIcon from '../assets/icons/chevron-left.svg';
import ChevronRightIcon from '../assets/icons/chevron-right.svg';
import CollapsedCalender from '../components/CollapsedCalender';
import WeeklyActivitiesIconImg from '../assets/icons/weekly-activities.png';
import MonthlyActivitiesIconImg from '../assets/icons/monthly-activities.png';
import {
  FilterType,
  GroupedActivityEvaluation,
  TotalGroupedActivityEvaluation,
  SubFilterType,
} from '../types/global';
import {Select} from 'native-base';
import FilterIconImg from '../assets/icons/filter.svg';
import Chip from '../components/Chip';
import ActivityItem from '../components/ActivityItem';
import TotalActivityBreakdown from '../components/TotalActivityBreakdown';
import {Moment} from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {ActivityService} from '../services/ActivityService';
import {useAppSelector} from '../redux/hooks';
import {getStartOfLastWeek} from '../utils/global';

const PeriodicEvaluation = ({
  route,
}: NativeStackScreenProps<ProfileNavigatorParamList>) => {
  const {filter, activityGroup} =
    route.params as ProfileNavigatorParamList['PeriodicEvaluation'];
  const [calenderDisplay, setCalendarDisplay] = useState<'weekly' | 'monthly'>(
    'weekly',
  );
  const [subFilter, setSubFilter] = useState(SubFilterType.INDIVIDUAL);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedActivityGroup, setSelectedActivityGroup] =
    useState<GroupedActivityEvaluation>();
  const [periodicEvaluation, setPeriodicEvaluation] = useState<
    GroupedActivityEvaluation[]
  >([]);
  const [totalPeriodicEvaluation, setTotalPeriodicEvaluation] = useState<
    TotalGroupedActivityEvaluation[]
  >([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [customPeriodEndDate, setCustomPeriodEndDate] = useState<Date>();

  const isFocused = useIsFocused();
  const globalActivity = useAppSelector(state => state.activity);
  const startOfLastWeek = getStartOfLastWeek();

  const handleOnSelectSubFilter = async (value: string) => {
    setSubFilter(value as SubFilterType);
    if (value === SubFilterType.TOTAL) {
      const groupedActivities = await ActivityService.groupPeriodicEvaluation(
        filter as Exclude<FilterType, FilterType.TODAY>,
        selectedGroup,
        currentDate,
        customPeriodEndDate,
      );
      // eslint-disable-next-line curly
      if (groupedActivities.length === 0) return;
      setSelectedGroup(groupedActivities[0].group);
      setTotalPeriodicEvaluation(groupedActivities);
    }
  };

  const onDateChange = async (
    date: Moment,
    type: 'START_DATE' | 'END_DATE',
  ) => {
    if (type === 'START_DATE') {
      setCurrentDate(date.toDate());
      setCustomPeriodEndDate(undefined);
    } else {
      setCustomPeriodEndDate(date.toDate());
      const groupedActivities = await ActivityService.groupPeriodicEvaluation(
        filter as Exclude<FilterType, FilterType.TODAY>,
        selectedGroup,
        currentDate,
        date.toDate(),
      );
      // eslint-disable-next-line curly
      if (groupedActivities.length === 0) return;
      setSelectedGroup(groupedActivities[0].group);
      setTotalPeriodicEvaluation(groupedActivities);
    }
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
        ...globalFonts.spaceGrotesk.regular,
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
        ...globalFonts.aeonik.bold,
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

  const handleCalenderDateChange = async (date: Date) => {
    setCurrentDate(date);
    const groupedActivities = await ActivityService.groupDailyEvaluation(
      activityGroup,
      date,
    );
    // eslint-disable-next-line curly
    if (groupedActivities.length === 0) return;
    setSelectedGroup(groupedActivities[0].title);
    setSelectedActivityGroup(groupedActivities[0]);
    setPeriodicEvaluation(groupedActivities);
  };

  const handleActivityGroupSelection = async (groupToSelect: string) => {
    setSelectedGroup(groupToSelect);
    if (subFilter === SubFilterType.INDIVIDUAL) {
      const selectedEvaluationGroup = periodicEvaluation.find(
        evaluationGroup => evaluationGroup.group === groupToSelect,
      );
      setSelectedActivityGroup(selectedEvaluationGroup);
    } else {
      const groupedActivities = await ActivityService.groupPeriodicEvaluation(
        filter as Exclude<FilterType, FilterType.TODAY>,
        groupToSelect,
        currentDate,
        customPeriodEndDate,
      );
      // eslint-disable-next-line curly
      if (groupedActivities.length === 0) return;
      setSelectedGroup(groupedActivities[0].group);
      setTotalPeriodicEvaluation(groupedActivities);
    }
  };

  const determineSelectedDateInLastWeek = (
    _firstDay: Date,
    _startOfLastWeek: Date,
  ) => {
    return _firstDay >= _startOfLastWeek ? _firstDay : _startOfLastWeek;
  };

  useEffect(() => {
    const getEvaluation = async () => {
      const dateToUse =
        filter === FilterType.LAST_WEEK
          ? determineSelectedDateInLastWeek(
              new Date(globalActivity.firstDay),
              startOfLastWeek,
            )
          : currentDate;
      const groupedActivities = await ActivityService.groupDailyEvaluation(
        activityGroup,
        dateToUse,
      );
      // eslint-disable-next-line curly
      if (groupedActivities.length === 0) return;
      setSelectedGroup(groupedActivities[0].group);
      setSelectedActivityGroup(groupedActivities[0]);
      setPeriodicEvaluation(groupedActivities);
    };
    getEvaluation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.calendarTitleRow}>
        <Text style={[globalStyles.text, styles.date]}>
          {currentDate.toDateString()}
        </Text>
        {filter === FilterType.MONTHLY && (
          <Pressable onPress={toggleCalenderDisplay}>
            {calenderDisplay === 'weekly' ? (
              <Image
                style={styles.calenderDisplayIcon}
                source={MonthlyActivitiesIconImg}
              />
            ) : (
              <Image
                style={styles.calenderDisplayIcon}
                source={WeeklyActivitiesIconImg}
              />
            )}
          </Pressable>
        )}
      </View>
      {calenderDisplay === 'weekly' ? (
        <CollapsedCalender
          type={
            filter === FilterType.LAST_WEEK
              ? FilterType.LAST_WEEK
              : FilterType.THIS_WEEK
          }
          onDateChange={handleCalenderDateChange}
          firstDate={new Date(globalActivity.firstDay)}
          isDisabled={subFilter === SubFilterType.TOTAL}
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
            minDate={new Date(globalActivity.firstDay)}
            maxDate={new Date()}
            enableDateChange={subFilter === SubFilterType.INDIVIDUAL}
          />
        </View>
      )}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderTitle}>{activityGroup}</Text>
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
        {periodicEvaluation.map((activity, index) => (
          <Chip
            key={index}
            title={activity.group}
            style={styles.chip}
            active={selectedGroup === activity.group}
            onPress={() => handleActivityGroupSelection(activity.group)}
          />
        ))}
      </ScrollView>

      <View style={styles.breakdown}>
        {subFilter === SubFilterType.TOTAL ? (
          <View>
            {totalPeriodicEvaluation?.map((content, index) => (
              <TotalActivityBreakdown
                key={`total-breakdown-${index}`}
                progress={content.progress}
                style={styles.breakdownItem}
                activities={content.activities}
              />
            ))}
          </View>
        ) : (
          <View>
            {selectedActivityGroup?.activities.map((content, index) => (
              <ActivityItem
                key={`breakdown-${index}`}
                activity={content.title}
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
  date: {
    ...globalFonts.aeonik.bold,
  },
  calendarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calenderDisplayIcon: {
    width: 36,
    height: 36,
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
    ...globalFonts.spaceGrotesk.bold,
  },
  sectionHeader: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderTitle: {
    ...globalStyles.text,
    ...globalFonts.spaceGrotesk.bold,
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
    ...globalFonts.aeonik.regular,
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
