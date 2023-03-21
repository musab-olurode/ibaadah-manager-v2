import React, {useEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Pressable} from 'native-base';
import ChevronDownIconImg from '../assets/icons/small-chevron-down.svg';
import {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setReminder} from '../utils/storage';
import {ReminderStorage} from '../types/global';
import {GlobalColors, globalStyles, normalizeFont} from '../styles/global';
export const ClockButton = ({
  action,
  activity,
  index,
  category,
  filteredReminder,
  repeatType,
}: any) => {
  const [hour, setHour] = useState<number | undefined>(0);
  const [minute, setMinute] = useState<number | undefined>(0);

  let reminderParams: string;
  useEffect(() => {
    const getReminder = async () => {
      await AsyncStorage.getItem(filteredReminder).then(result => {
        const parsedResult: ReminderStorage[] = JSON.parse(result!);
        if (result) {
          let elementClicked: string;
          if (activity === 'Solah') {
            // console.log(action.group);
            elementClicked = action.group;
          } else {
            // console.log(action.title);
            elementClicked = action.title;
          }
          parsedResult.forEach(element => {
            if (
              element.title === activity &&
              element.particularActivity === elementClicked
            ) {
              setHour(element.hour);
              setMinute(element.minute);
            }
          });
        }
      });
    };
    getReminder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChangeNotificationDate = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    let newReminder: ReminderStorage;

    if (activity === 'Solah') {
      reminderParams = action.group;
    } else {
      reminderParams = action.title;
    }

    const message = `It's ${
      date!.getHours() < 10 ? 0 : ''
    }${date!.getHours()}:${
      date!.getMinutes() < 10 ? 0 : ''
    }${date?.getMinutes()}, time for ${reminderParams} ${
      activity === 'Adhkar' ? activity : ''
    }`;
    switch (event.type) {
      case 'set':
        date!.setSeconds(0);
        date!.setMilliseconds(0);
        newReminder = {
          title: activity,
          message,
          particularActivity: reminderParams,
          hour: category !== 'Monthly' ? date!.getHours() : date!.getMonth(),
          minute: category !== 'Monthly' ? date!.getMinutes() : date!.getDate(),
        };
        PushNotification.localNotificationSchedule({
          channelId: 'ibaadah-id',
          message,
          title: activity,
          bigText: `bigText ${message}`,
          date: date!,
          allowWhileIdle: true,
          vibrate: true,
          playSound: true,
          repeatType,
          id: index,
        });
        const getReminderAfterAdd = async () => {
          await AsyncStorage.getItem(filteredReminder)?.then(result => {
            const filteredReminders = JSON.parse(result!)?.filter(
              (reminder: ReminderStorage) =>
                reminder.particularActivity !== newReminder.particularActivity,
            );
            filteredReminders
              ? setReminder(
                  [...filteredReminders!, newReminder],
                  filteredReminder,
                )
              : setReminder([newReminder], filteredReminder);
          });
        };
        getReminderAfterAdd();
        setHour(date!.getHours());
        setMinute(date!.getMinutes());
        break;
      default:
        break;
    }
  };

  const handleOnPressShowTimePicker = (actionParam: any) => {
    let mode: 'time' | 'date';

    if (category === 'Monthly') {
      mode = 'date';
    } else {
      mode = 'time';
    }
    reminderParams = actionParam;
    DateTimePickerAndroid.open({
      mode: mode,
      value: new Date(),
      onChange: handleOnChangeNotificationDate,
    });
  };

  return (
    <Pressable
      style={styles.timePickerBtn}
      onPress={() => handleOnPressShowTimePicker(action)}>
      <Text style={styles.timePickerBtnText}>
        {hour! < 10 && 0}
        {hour}:{minute! < 10 && 0}
        {minute}
        {hour! < 12 ? 'AM' : 'PM'}
      </Text>
      <ChevronDownIconImg fill="white" style={styles.chevron} />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  timePickerBtn: {
    backgroundColor: GlobalColors.primary,
    borderRadius: 100,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePickerBtnText: {
    ...globalStyles.text,
    color: 'white',
    fontSize: normalizeFont(12),
  },
  chevron: {
    marginLeft: 8,
  },
});
