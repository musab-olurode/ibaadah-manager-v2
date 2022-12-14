import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {GlobalColors, globalStyles, normalizeFont} from '../styles/global';

export interface CollapsedCalenderProps {
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
}

const CollapsedCalender = ({
  onDateChange,
  defaultDate,
}: CollapsedCalenderProps) => {
  const [daysInTheWeek, setDaysInTheWeek] = useState(
    new Array(7).fill(new Date()),
  );
  const [selectedDate, setSelectedDate] = useState(defaultDate || new Date());
  const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleOnSelectDate = (date: Date) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  useEffect(() => {
    moment.updateLocale('en', {
      week: {
        dow: 1,
      },
    });
    var startOfWeek = moment().startOf('isoWeek');
    var endOfWeek = moment().endOf('isoWeek');
    var days = [];
    var day = startOfWeek;
    while (day <= endOfWeek) {
      days.push(day.toDate());
      day = day.clone().add(1, 'd');
    }
    const firstDay = days[0];
    days.pop();
    days.unshift(moment(firstDay).clone().subtract(1, 'd').toDate());
    setDaysInTheWeek(days);
  }, []);

  return (
    <View style={styles.calender}>
      <View style={styles.weekHeader}>
        {daysOfTheWeek.map((day, index) => (
          <Text key={`day-${index}`} style={[styles.date, styles.weekDay]}>
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
                date.getDate() === selectedDate.getDate() &&
                  styles.selectedDateText,
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
