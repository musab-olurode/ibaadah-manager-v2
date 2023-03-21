import {addDays} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {
  GlobalColors,
  globalFonts,
  globalStyles,
  normalizeFont,
} from '../styles/global';
import {FilterType} from '../types/global';
import {getStartOfLastWeek, getStartOfThisWeek} from '../utils/global';

export interface CollapsedCalenderProps {
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  type: FilterType.THIS_WEEK | FilterType.LAST_WEEK;
  firstDate: Date;
  isDisabled?: boolean;
}

const CollapsedCalender = ({
  onDateChange,
  type,
  defaultDate,
  firstDate,
  isDisabled,
}: CollapsedCalenderProps) => {
  const [daysInTheWeek, setDaysInTheWeek] = useState(
    new Array(7).fill(new Date()),
  );
  const [selectedDate, setSelectedDate] = useState(defaultDate || new Date());
  const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleOnSelectDate = (date: Date) => {
    if (!isDisabled && date >= firstDate && date <= new Date()) {
      setSelectedDate(date);
      if (onDateChange) {
        onDateChange(date);
      }
    }
  };

  useEffect(() => {
    var startOfWeek =
      type === FilterType.THIS_WEEK
        ? getStartOfThisWeek()
        : getStartOfLastWeek();
    var daysInWeek = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(startOfWeek, i);
      daysInWeek.push(day);
    }
    setDaysInTheWeek(daysInWeek);
    if (type === FilterType.LAST_WEEK && !defaultDate) {
      setSelectedDate(daysInWeek[0]);
      if (onDateChange) {
        onDateChange(daysInWeek[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.calender}>
      <View style={styles.weekHeader}>
        {daysOfTheWeek.map((day, index) => (
          <Text
            key={`day-${index}`}
            style={[
              styles.date,
              styles.weekDay,
              globalFonts.spaceGrotesk.bold,
            ]}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.dayRow}>
        {daysInTheWeek.map((date, index) => (
          <Pressable
            key={`date-${index}`}
            style={[
              styles.date,
              date.getDate() === selectedDate.getDate() && styles.selectedDate,
            ]}
            onPress={() => handleOnSelectDate(date)}>
            <Text
              style={[
                styles.weekDay,
                (date < firstDate || date > new Date()) && styles.disabledDate,
                date.getDate() === selectedDate.getDate() &&
                  styles.selectedDateText,
                globalFonts.aeonik.bold,
              ]}>
              {date.getDate()}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calender: {
    borderRadius: 8,
    backgroundColor: GlobalColors.primary,
    padding: 12,
    marginBottom: 10,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  date: {
    width: 32,
    height: 32,
    textAlignVertical: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDay: {
    ...globalStyles.text,
    color: 'white',
    fontSize: normalizeFont(14),
    textAlign: 'center',
  },
  disabledDate: {
    color: GlobalColors.gray,
  },
  selectedDate: {
    backgroundColor: 'white',
    borderRadius: 100,
    color: GlobalColors.primary,
    padding: 6,
    paddingVertical: 4,
  },
  selectedDateText: {
    color: GlobalColors.primary,
    textAlign: 'center',
  },
});

export default CollapsedCalender;
