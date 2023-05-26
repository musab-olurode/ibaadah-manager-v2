import React, {useEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Pressable} from 'native-base';
import ChevronDownIconImg from '../assets/icons/small-chevron-down.svg';
import {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setReminder} from '../utils/storage';
import {ReminderStorage} from '../types/global';

import {
  GlobalColors,
  globalFonts,
  globalStyles,
  normalizeFont,
} from '../styles/global';
import {
  getOrdinalSuffix,
  monthNames,
  notificationMessage,
  setPushNotifcation,
  weekDays,
} from '../utils/notificationService';
import {useTranslation} from 'react-i18next';
import {resolveActivityDetails} from '../utils/activities';
import PushNotification from 'react-native-push-notification';

export const ClockButton = ({
  action,
  activity,
  index,
  category,
  reminderKeyInDb,
  repeatType,
  apiSolah,
}: any) => {
  const {t} = useTranslation();
  const [notset, setNotset] = useState(true);
  const [hour, setHour] = useState<number | number>(0);
  const [minute, setMinute] = useState<number | number>(0);
  const [monthDate, setMonthDate] = useState<string>(
    t('common:timeNotSet') as string,
  );
  const [isDaily, setIsDaily] = useState(true);
  const [isWeekly, setIsWeekly] = useState(true);
  const [defaultDate, setDefaultDate] = useState<Date>(new Date());

  let reminderParams: string;
  const repeatTime = isWeekly ? 1 : 30;
  useEffect(() => {
    reminderKeyInDb !== 'DAILY_REMINDER' && setIsDaily(false);
    reminderKeyInDb !== 'WEEKLY_REMINDER' && setIsWeekly(false);
    let runOnce = true;
    const getReminder = async () => {
      await AsyncStorage.getItem(reminderKeyInDb).then(result => {
        const parsedResult: ReminderStorage[] = JSON.parse(result!);
        // runOnce && console.log(parsedResult);
        let elementTitle: string;
        if (activity === t('common:solah')) {
          elementTitle = action.group;
        } else {
          elementTitle = resolveActivityDetails(action.title, t);
        }

        if (result) {
          parsedResult.forEach(element => {
            if (
              (activity === t('common:solah') ||
                elementTitle === t('common:dhua')) &&
              element.title !== activity &&
              element.particularActivity !== elementTitle
            ) {
              if (runOnce) {
                setDefaultSolatTime(elementTitle);
                runOnce = false;
              }
            } else if (activity === t('common:fasting')) {
              setDefaultMonthlyFasting();
            }

            if (
              element.title === activity &&
              element.particularActivity === elementTitle
            ) {
              setNotset(false);
              reminderKeyInDb !== 'WEEKLY_REMINDER'
                ? setMonthDate(
                    `${element.date}${getOrdinalSuffix(element.date!)} ${t(
                      'common:ofEveryMonth',
                    )}`,
                  )
                : setMonthDate(element.day!);
              setHour(element.hour);
              setMinute(element.minute);
              defaultDate.setMinutes(element.minute);
              defaultDate.setHours(element.hour);
              element.date && defaultDate.setDate(element.date);
              element.month && defaultDate.setMonth(element.month);
              setDefaultDate(defaultDate);
              if (
                activity === t('common:fasting') &&
                reminderKeyInDb === 'MONTHLY_REMINDER'
              ) {
                apiSolah.Fajr
                  ? (elementTitle =
                      action.title.split('the')[0] + apiSolah.hijri.month.en)
                  : null;
              }
              const message = notificationMessage(
                defaultDate,
                elementTitle,
                activity,
                category,
                t,
              );
              setPushNotifcation(
                message,
                activity,
                defaultDate,
                index,
                repeatType,
                repeatTime,
                t,
              );
              PushNotification.cancelLocalNotification(`${index}${index}`);
            }
          });
        } else if (
          activity === t('common:solah') ||
          elementTitle === t('common:dhua')
        ) {
          setDefaultSolatTime(elementTitle);
        } else if (activity === t('common:fasting')) {
          setDefaultMonthlyFasting();
        }
      });
    };
    getReminder();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiSolah]);

  const setDefaultMonthlyFasting = () => {
    if (reminderKeyInDb === 'MONTHLY_REMINDER') {
      const fastingDay = Number(action.title.slice(0, 2));
      const date = new Date();
      const getDaysInMonth = (monthIndex: number) => {
        return new Date(
          date.getFullYear(),
          date.getMonth() + monthIndex,
          0,
        ).getDate();
      };

      const hijriDay = Number(apiSolah.hijri.day);
      let monthName = date.getMonth();
      const daysTo = fastingDay - hijriDay;
      let gregDay = daysTo + new Date().getDate();

      if (gregDay > getDaysInMonth(1)) {
        gregDay -= getDaysInMonth(1);
        monthName += 1;
      } else if (gregDay < 1) {
        gregDay = getDaysInMonth(0) + gregDay;
        monthName -= 1;
      }
      const result =
        gregDay + getOrdinalSuffix(gregDay) + ' of ' + monthNames[monthName];
      date!.setSeconds(0);
      date!.setMilliseconds(0);
      date.setMinutes(0);
      date.setHours(apiSolah.Fajr.slice(0, 2) - 3);
      date.setDate(gregDay);
      date.setMonth(monthName);
      setMinute(date.getMinutes());
      setHour(date.getHours());
      const elementTitle =
        action.title.split('the')[0] + apiSolah.hijri.month.en;
      const message = notificationMessage(
        date,
        elementTitle,
        activity,
        category,
        t,
      );
      // console.log(message);
      setPushNotifcation(
        message,
        activity,
        date,
        index,
        repeatType,
        repeatTime,
        t,
        true,
      );
      defaultDate.setMinutes(date.getMinutes());
      defaultDate.setHours(date.getHours());
      defaultDate.setDate(date.getDate());
      defaultDate.setMonth(date.getMonth());
      setNotset(false);
      setMonthDate(result);
      date.setDate(gregDay - 1);
      date.setHours(Number(apiSolah.Maghrib.slice(0, 2)) + 1);
      setPushNotifcation(
        message,
        activity,
        date,
        Number(`${index}${index}`),
        repeatType,
        repeatTime,
        t,
        true,
      );
    } else if (reminderKeyInDb === 'WEEKLY_REMINDER') {
      const weekFastingDate: Date = new Date();
      weekFastingDate.setMilliseconds(0);
      weekFastingDate.setSeconds(0);
      weekFastingDate.setMinutes(0);
      weekFastingDate.setHours(apiSolah.Fajr.slice(0, 2) - 3);
      const day = weekDays.indexOf(action.title) - new Date().getDay();
      weekFastingDate.setDate(new Date().getDate() + day);
      setMonthDate(
        weekFastingDate.toLocaleDateString('en-US', {
          weekday: 'long',
        }),
      );
      setMinute(weekFastingDate.getMinutes());
      setHour(weekFastingDate.getHours());
      setNotset(false);
      const message = notificationMessage(
        weekFastingDate,
        action.title,
        activity,
        category,
        t,
      );
      // console.log(message);
      setPushNotifcation(
        message,
        activity,
        defaultDate,
        index,
        repeatType,
        repeatTime,
        t,
        true,
      );
    }
  };

  const setDefaultSolatTime = (elementTitle: string) => {
    if (apiSolah.Fajr) {
      reminderParams = elementTitle;
      setNotset(false);

      const reusableSet = (indexSolah: string) => {
        const date = new Date();
        const localElementTitle = indexSolah;
        const apiHour = apiSolah[localElementTitle].slice(0, 2);
        const apiMinute = apiSolah[localElementTitle].slice(3, 5);
        date.setMilliseconds(0);
        date.setSeconds(0);
        date.setMinutes(apiMinute);
        date.setHours(apiHour);
        setHour(apiHour);
        setMinute(apiMinute);
        const message = notificationMessage(
          date,
          reminderParams,
          activity,
          category,
          t,
        );
        setPushNotifcation(
          message,
          activity,
          date,
          index,
          repeatType,
          1,
          t,
          true,
        );
      };

      Object.keys(apiSolah).forEach(indexSolah => {
        if (indexSolah.startsWith(elementTitle.slice(0, 3))) {
          reusableSet(indexSolah);
        }
      });
      elementTitle === t('common:dhua') && reusableSet('Sunrise');
    }
  };

  const setReminderToDb = async (newReminder: ReminderStorage) => {
    await AsyncStorage.getItem(reminderKeyInDb)?.then(result => {
      const filteredReminders = JSON.parse(result!)?.filter(
        (reminder: ReminderStorage) =>
          reminder.particularActivity !== newReminder.particularActivity,
      );
      filteredReminders
        ? setReminder([...filteredReminders, newReminder], reminderKeyInDb)
        : setReminder([newReminder], reminderKeyInDb);
    });
  };

  const handleOnChangeNotificationDate = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    let newReminder: ReminderStorage;
    if (activity === t('common:solah')) {
      reminderParams = action.group;
    } else {
      reminderParams = action.title;
    }
    const message = notificationMessage(
      date!,
      resolveActivityDetails(reminderParams, t),
      activity,
      category,
      t,
    );
    switch (event.type) {
      case 'set':
        date!.setSeconds(0);
        date!.setMilliseconds(0);
        if (isDaily) {
          newReminder = {
            title: activity,
            message,
            particularActivity: resolveActivityDetails(reminderParams, t),
            hour: date!.getHours(),
            minute: date!.getMinutes(),
          };
          setPushNotifcation(message, activity, date!, index, repeatType, 1, t);
          setReminderToDb(newReminder);
          setHour(date!.getHours());
          setMinute(date!.getMinutes());
          defaultDate.setMinutes(date!.getMinutes());
          defaultDate.setHours(date!.getHours());
          defaultDate.setDate(date!.getDate());
          defaultDate.setMonth(date!.getMonth());
          setDefaultDate(defaultDate);
          setNotset(false);
        } else {
          if (monthDate === t('common:timeNotSet')) {
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
    const message = notificationMessage(
      date!,
      resolveActivityDetails(reminderParams, t),
      activity,
      category,
      t,
    );

    switch (event.type) {
      case 'set':
        let newReminder: ReminderStorage = {
          title: activity,
          message,
          particularActivity: resolveActivityDetails(reminderParams, t),
          hour: date!.getHours(),
          minute: date!.getMinutes(),
          date: date?.getDate(),
          day: date!.toLocaleDateString('en-US', {
            weekday: 'long',
          }),
          month: date?.getMonth(),
        };
        setPushNotifcation(
          message,
          activity,
          date!,
          index,
          repeatType,
          repeatTime,
          t,
        );
        setReminderToDb(newReminder);
        setHour(date!.getHours());
        setMinute(date!.getMinutes());
        isWeekly
          ? setMonthDate(
              date!.toLocaleDateString('en-US', {
                weekday: 'long',
              }),
            )
          : setMonthDate(
              `${date!.getDate()}${getOrdinalSuffix(date!.getDate())} ${t(
                'common:ofEveryMonth',
              )}`,
            );
        setNotset(false);
        break;
      default:
    }
  };

  const handleOnPressShowTimePicker = (actionParam: any) => {
    let mode: 'time' | 'date';
    if (category === 'Daily') {
      mode = 'time';
    } else {
      mode = 'date';
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
      {notset ? (
        <Text style={styles.timePickerBtnText}>{t('common:timeNotSet')}</Text>
      ) : !isDaily ? (
        <Text style={styles.timePickerBtnText}>
          {monthDate}
          {monthDate !== t('common:timeNotSet') &&
            `${isWeekly ? ' ' : '\n'} ${
              hour === 0 ? 12 : hour! < 13 ? hour : hour - 12
            }:${typeof minute !== 'string' && minute < 10 ? 0 : ''}${minute} ${
              hour < 12 ? 'AM' : 'PM'
            }`}
        </Text>
      ) : (
        <Text style={styles.timePickerBtnText}>
          {hour !== 0
            ? hour < 13
              ? typeof hour !== 'string' && hour <= 9 && '0'
              : hour - 12 <= 9 && 0
            : ''}
          {hour === 0 ? 12 : hour < 13 ? hour : hour - 12}:
          {typeof minute !== 'string' && minute < 10 && 0}
          {minute} {hour < 12 ? 'AM' : 'PM'}
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
