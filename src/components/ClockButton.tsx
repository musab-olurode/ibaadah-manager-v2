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
import {getUser, setReminder} from '../utils/storage';
import {ReminderStorage} from '../types/global';
import {
  GlobalColors,
  globalFonts,
  globalStyles,
  normalizeFont,
} from '../styles/global';
import {monthNames} from '../utils/notificationService';

export const ClockButton = ({
  actionId,
  action,
  activity,
  index,
  category,
  filteredReminder,
  repeatType,
  uniqueId,
}: any) => {
  const [username, setUsername] = useState<string>('');
  const [notset, setNotset] = useState<boolean>(true);
  const [hour, setHour] = useState<number | undefined>(0);
  const [minute, setMinute] = useState<number | undefined>(0);
  const [monthDate, setMonthDate] = useState<string>('Not Set');
  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  const [defaultDate, setDefaultDate] = useState<Date>(new Date());

  let reminderParams: string;
  useEffect(() => {
    filteredReminder === 'MONTHLY_REMINDER' && setIsMonthly(true);
    getUser().then(user => setUsername(user.name));
    const getReminder = async () => {
      await AsyncStorage.getItem(filteredReminder).then(result => {
        const parsedResult: ReminderStorage[] = JSON.parse(result!);
        if (result) {
          let elementClicked: string;
          if (activity === 'Solah') {
            elementClicked = action.group;
          } else {
            elementClicked = action.title;
          }
          parsedResult.forEach(element => {
            if (
              element.title === activity &&
              element.particularActivity === elementClicked
            ) {
              setNotset(false);
              setMonthDate(`${element.date} of every month`);
              setHour(element.hour);
              setMinute(element.minute);
              defaultDate.setMinutes(element.minute);
              defaultDate.setHours(element.hour);
              element.date && defaultDate.setDate(element.date);
              element.month && defaultDate.setMonth(element.month);
              setDefaultDate(defaultDate);
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
      date!.getHours() < 13 ? date!.getHours() : date!.getHours() - 12
    }:${date!.getMinutes() < 10 ? 0 : ''}${date?.getMinutes()} ${
      date!.getHours() < 12 ? 'AM' : 'PM'
    }, time for ${reminderParams} ${activity === 'Adhkar' ? activity : ''}`;
    // console.log(uniqueId + index);
    switch (event.type) {
      case 'set':
        if (!isMonthly) {
          date!.setSeconds(0);
          date!.setMilliseconds(0);
          newReminder = {
            title: activity,
            message,
            particularActivity: reminderParams,
            hour: date!.getHours(),
            minute: date!.getMinutes(),
          };
          PushNotification.localNotificationSchedule({
            channelId: 'ibaadah-id',
            message,
            title: activity,
            bigText: `Salaam Alaykum ${username}, ${message}`,
            date: date!,
            allowWhileIdle: true,
            vibrate: true,
            playSound: true,
            soundName: 'narutojutsu.mp3',
            repeatType,
            repeatTime: 1,
            id: actionId + uniqueId + index,
            priority: 'high',
          });
          const getReminderAfterAdd = async () => {
            await AsyncStorage.getItem(filteredReminder)?.then(result => {
              const filteredReminders = JSON.parse(result!)?.filter(
                (reminder: ReminderStorage) =>
                  reminder.particularActivity !==
                  newReminder.particularActivity,
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
          defaultDate.setMinutes(date!.getMinutes());
          defaultDate.setHours(date!.getHours());
          defaultDate.setDate(date!.getDate());
          defaultDate.setMonth(date!.getMonth());
          setDefaultDate(defaultDate);

          setNotset(false);
        } else {
          if (monthDate === 'Not Set') {
            date?.setMinutes(new Date().getMinutes());
            date?.setHours(new Date().getHours());
          }
          DateTimePickerAndroid.open({
            mode: 'time',
            value: date!,
            onChange: handleOnChangeMonthTime,
            is24Hour: false,
          });
        }
        break;
      default:
        break;
    }
  };
  const handleOnChangeMonthTime = (event: DateTimePickerEvent, date?: Date) => {
    const message = `It's ${date!.getDate()} of ${
      monthNames[date!.getMonth()]
    }, time ${activity === 'Ziyaarah' ? 'to' : 'for'} ${reminderParams}`;

    switch (event.type) {
      case 'set':
        date!.setSeconds(0);
        date!.setMilliseconds(0);
        let newReminder: ReminderStorage = {
          title: activity,
          message,
          particularActivity: reminderParams,
          hour: date!.getHours(),
          minute: date!.getMinutes(),
          date: date?.getDate(),
          month: date?.getMonth(),
        };
        PushNotification.localNotificationSchedule({
          channelId: 'ibaadah-id',
          message,
          title: activity,
          bigText: `Salaam Alaykum ${username}, ${message}`,
          date: date!,
          allowWhileIdle: true,
          vibrate: true,
          playSound: true,
          soundName: 'narutojutsu',
          id: index,
          repeatType: 'day',
          repeatTime: 30,
        });
        const setReminderToDb = async () => {
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
        setReminderToDb();
        setHour(date!.getHours());
        setMinute(date!.getMinutes());
        setMonthDate(`${date!.getDate()} of every month`);
        break;
      default:
    }
  };
  const handleOnPressShowTimePicker = (actionParam: any) => {
    let mode: 'time' | 'date';
    if (category === 'Monthly') {
      mode = 'date';
    } else {
      mode = 'time';
    }
    if (notset) {
      defaultDate.setHours(new Date().getHours());
      defaultDate.setMinutes(new Date().getMinutes());
    }
    reminderParams = actionParam;
    DateTimePickerAndroid.open({
      mode: mode,
      value: defaultDate,
      onChange: handleOnChangeNotificationDate,
      is24Hour: false,
    });
  };

  return (
    <Pressable
      style={styles.timePickerBtn}
      onPress={() => handleOnPressShowTimePicker(action)}>
      {isMonthly ? (
        <Text style={styles.timePickerBtnText}>
          {monthDate}
          {monthDate !== 'Not Set' &&
            `\n ${hour === 0 ? 12 : hour! < 13 ? hour! : hour! - 12}:${
              minute! < 10 ? 0 : ''
            }${minute} ${hour! < 12 ? 'AM' : 'PM'}`}
        </Text>
      ) : notset ? (
        <Text style={styles.timePickerBtnText}>Not Set</Text>
      ) : (
        <Text style={styles.timePickerBtnText}>
          {hour === 0 ? 12 : hour! < 13 ? hour! : hour! - 12}:
          {minute! < 10 && 0}
          {minute} {hour! < 12 ? 'AM' : 'PM'}
        </Text>
      )}
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
    ...globalFonts.aeonik.bold,
    textAlign: 'center',
  },
  chevron: {
    marginLeft: 8,
  },
});
