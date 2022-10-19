import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
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
import {FilterType, SubFilterType} from '../types/global';
import {Select} from 'native-base';
import FilterIconImg from '../assets/icons/filter.svg';
import Chip from '../components/Chip';
import {SOLAH} from '../utils/activities';
import ActivityItem from '../components/ActivityItem';
import TotalActivityBreakdown from '../components/TotalActivityBreakdown';
import {Moment} from 'moment';

const PeriodicEvaluation = ({
  route,
}: NativeStackScreenProps<ProfileNavigatorParamList>) => {
  const {filter} =
    route.params as ProfileNavigatorParamList['PeriodicEvaluation'];
  const [calenderDisplay, setCalendarDisplay] = useState<'weekly' | 'monthly'>(
    'weekly',
  );
  const [subFilter, setSubFilter] = useState(SubFilterType.INDIVIDUAL);
  const [selectedChip, setSelectedChip] = useState('Fajr');

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

  return (
    <ScrollView style={globalStyles.container}>
      {filter === FilterType.MONTHLY ||
        (filter === FilterType.LAST_WEEK && (
          <View style={styles.toggleCalendarDisplay}>
            <Pressable onPress={toggleCalenderDisplay}>
              {calenderDisplay === 'weekly' ? (
                <Image source={MonthlyActivitiesIconImg} />
              ) : (
                <Image source={WeeklyActivitiesIconImg} />
              )}
            </Pressable>
          </View>
        ))}
      {calenderDisplay === 'weekly' ? (
        <CollapsedCalender />
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
        <Text style={styles.sectionHeaderTitle}>5 daily solah</Text>
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
        {SOLAH.map((solah, index) => (
          <Chip
            key={index}
            title={solah.title}
            style={styles.chip}
            active={selectedChip === solah.title}
            onPress={() => setSelectedChip(solah.title)}
          />
        ))}
      </ScrollView>

      <View style={styles.breakdown}>
        {subFilter === SubFilterType.TOTAL ? (
          <TotalActivityBreakdown
            style={styles.breakdownItem}
            activities={SOLAH[0].content.map(content => ({
              name: content.activity,
              completed: 0,
              total: 30,
            }))}
          />
        ) : (
          <View>
            {SOLAH[0].content.map((content, index) => (
              <ActivityItem
                key={`breakdown-${index}`}
                activity={content.activity}
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
