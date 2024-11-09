import React, {useEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Pressable} from 'native-base';
import ChevronDownIconImg from '../assets/icons/small-chevron-down.svg';
import {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApiReminderData, setReminder} from '../utils/storage';
import {
  ActivityCategory,
  RawActivity,
  ReminderStorage,
  SolahApiData,
} from '../types/global';
import {
  GlobalColors,
  globalFonts,
  globalStyles,
  normalizeFont,
} from '../styles/global';
import {
  ReminderService,
  monthNames,
  weekDays,
} from '../services/ReminderService';
import {useTranslation} from 'react-i18next';
import {getTranslatedActivityTitle} from '../utils/activities';
import PushNotification from 'react-native-push-notification';
import {getOrdinalSuffix} from '../utils/global';
import {Reminder} from '../database/entities/Reminder';

export type ClockButtonProps = {
  activityLabel: string;
  activityGroup: string;
  index: number;
  category: ActivityCategory;
  reminderKeyInDb: string;
  repeatType: 'day' | 'week' | 'time';
};

export const ClockButton = ({
  activityLabel,
  activityGroup,
  index,
  category,
  reminderKeyInDb,
  repeatType,
}: ClockButtonProps) => {
  const {t} = useTranslation();

  const [solahTimings, setSolahTimings] = useState<SolahApiData>();
  const [timeNotSet, setTimeNotSet] = useState(true);
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [monthDate, setMonthDate] = useState<string>(t('common:timeNotSet'));
  const [isDaily, setIsDaily] = useState(true);
  const [isWeekly, setIsWeekly] = useState(true);
  const [defaultDate, setDefaultDate] = useState<Date>(new Date());

  const IS_DAILY_REMINDER = category === ActivityCategory.Daily,
    IS_WEEKLY_REMINDER = category === ActivityCategory.Weekly;
  const REPEAT_TIME = IS_WEEKLY_REMINDER ? 1 : 30;

  let reminderParams: string;
  const repeatTime = isWeekly ? 1 : 30;

  useEffect(() => {
    const getSolahTimings = async () => {
      const solahTimings = (await getApiReminderData()) as SolahApiData;
      setSolahTimings(solahTimings);
    };
    getSolahTimings();
  }, []);

  useEffect(() => {
    reminderKeyInDb !== 'DAILY_REMINDER' && setIsDaily(false);
    reminderKeyInDb !== 'WEEKLY_REMINDER' && setIsWeekly(false);
    let runOnce = true;
    const getReminder = async () => {
      await AsyncStorage.getItem(reminderKeyInDb).then(result => {
        const parsedResult: ReminderStorage[] = JSON.parse(result!);
        // runOnce && console.log(parsedResult);
        let elementTitle: string;
        if (activityGroup === t('common:solah')) {
          elementTitle = activityLabel;
        } else {
          elementTitle = getTranslatedActivityTitle(activityLabel);
        }

        console.log(activityLabel, elementTitle);

        if (result) {
          parsedResult.forEach(element => {
            if (
              (activityGroup === t('common:solah') ||
                elementTitle === t('common:dhua')) &&
              element.group !== activityGroup &&
              element.title !== elementTitle
            ) {
              if (runOnce) {
                setDefaultSolahTime(elementTitle);
                runOnce = false;
              }
            } else if (activityGroup === t('common:fasting')) {
              setDefaultMonthlyFasting();
            }

            if (
              element.group === activityGroup &&
              element.title === elementTitle
            ) {
              setTimeNotSet(false);
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
                activityGroup === t('common:fasting') &&
                reminderKeyInDb === 'MONTHLY_REMINDER'
              ) {
                solahTimings?.timings.Fajr
                  ? (elementTitle =
                      activityLabel.split('the')[0] +
                      solahTimings?.date.hijri.month.en)
                  : null;
              }
              const message = ReminderService.getNotificationMessage(
                defaultDate,
                elementTitle,
                activityGroup,
                category,
              );
              ReminderService.setPushNotification(
                message,
                activityGroup,
                defaultDate,
                index,
                repeatType,
                repeatTime,
              );
              PushNotification.cancelLocalNotification(`${index}${index}`);
            }
          });
        } else if (
          activityGroup === t('common:solah') ||
          elementTitle === t('common:dhua')
        ) {
          setDefaultSolahTime(elementTitle);
        } else if (activityGroup === t('common:fasting')) {
          setDefaultMonthlyFasting();
        }
      });
    };
    getReminder();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solahTimings]);

  const setDefaultMonthlyFasting = () => {
    if (reminderKeyInDb === 'MONTHLY_REMINDER') {
      const fastingDay = Number(activityLabel.slice(0, 2));
      const date = new Date();
      const getDaysInMonth = (monthIndex: number) => {
        return new Date(
          date.getFullYear(),
          date.getMonth() + monthIndex,
          0,
        ).getDate();
      };

      const hijriDay = Number(solahTimings?.date.hijri.day);
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
      date.setHours(Number(solahTimings?.timings.Fajr.slice(0, 2)) - 3);
      date.setDate(gregDay);
      date.setMonth(monthName);
      setMinute(date.getMinutes());
      setHour(date.getHours());
      const elementTitle =
        activityLabel.split('the')[0] + solahTimings?.date.hijri.month.en;
      const message = ReminderService.getNotificationMessage(
        date,
        elementTitle,
        activityGroup,
        category,
      );
      // console.log(message);
      ReminderService.setPushNotification(
        message,
        activityGroup,
        date,
        index,
        repeatType,
        repeatTime,
        true,
      );
      defaultDate.setMinutes(date.getMinutes());
      defaultDate.setHours(date.getHours());
      defaultDate.setDate(date.getDate());
      defaultDate.setMonth(date.getMonth());
      setTimeNotSet(false);
      setMonthDate(result);
      date.setDate(gregDay - 1);
      date.setHours(Number(solahTimings?.timings.Maghrib.slice(0, 2)) + 1);
      ReminderService.setPushNotification(
        message,
        activityGroup,
        date,
        Number(`${index}${index}`),
        repeatType,
        repeatTime,
        true,
      );
    } else if (reminderKeyInDb === 'WEEKLY_REMINDER') {
      const weekFastingDate: Date = new Date();
      weekFastingDate.setMilliseconds(0);
      weekFastingDate.setSeconds(0);
      weekFastingDate.setMinutes(0);
      weekFastingDate.setHours(
        Number(solahTimings?.timings.Fajr.slice(0, 2)) - 3,
      );
      const day = weekDays.indexOf(activityLabel) - new Date().getDay();
      weekFastingDate.setDate(new Date().getDate() + day);
      setMonthDate(
        weekFastingDate.toLocaleDateString('en-US', {
          weekday: 'long',
        }),
      );
      setMinute(weekFastingDate.getMinutes());
      setHour(weekFastingDate.getHours());
      setTimeNotSet(false);
      const message = ReminderService.getNotificationMessage(
        weekFastingDate,
        activityLabel,
        activityGroup,
        category,
      );
      // console.log(message);
      ReminderService.setPushNotification(
        message,
        activityGroup,
        defaultDate,
        index,
        repeatType,
        repeatTime,
        true,
      );
    }
  };

  const setDefaultSolahTime = (elementTitle: string) => {
    if (solahTimings?.timings.Fajr) {
      reminderParams = elementTitle;
      setTimeNotSet(false);

      const reusableSet = (indexSolah: keyof typeof solahTimings.timings) => {
        const date = new Date();
        const localElementTitle = indexSolah;
        const apiHour = Number(
          solahTimings.timings[localElementTitle].slice(0, 2),
        );
        const apiMinute = Number(
          solahTimings.timings[localElementTitle].slice(3, 5),
        );
        date.setMilliseconds(0);
        date.setSeconds(0);
        date.setMinutes(apiMinute);
        date.setHours(apiHour);
        setHour(apiHour);
        setMinute(apiMinute);
        const message = ReminderService.getNotificationMessage(
          date,
          reminderParams,
          activityGroup,
          category,
        );
        ReminderService.setPushNotification(
          message,
          activityGroup,
          date,
          index,
          repeatType,
          1,
          true,
        );
      };

      Object.keys(solahTimings.timings).forEach(indexSolah => {
        if (indexSolah.startsWith(elementTitle.slice(0, 3))) {
          reusableSet(indexSolah as keyof typeof solahTimings.timings);
        }
      });
      elementTitle === t('common:dhua') && reusableSet('Sunrise');
    }
  };

  const setReminderToDb = async (newReminder: ReminderStorage) => {
    await AsyncStorage.getItem(reminderKeyInDb)?.then(result => {
      const filteredReminders = JSON.parse(result!)?.filter(
        (reminder: ReminderStorage) => reminder.title !== newReminder.title,
      );
      filteredReminders
        ? setReminder([...filteredReminders, newReminder], reminderKeyInDb)
        : setReminder([newReminder], reminderKeyInDb);
    });
  };

  const handleOnChangeNotificationDate = async (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (event.type !== 'set') {
      return;
    }

    const activityTitle = getTranslatedActivityTitle(activityLabel);

    const message = ReminderService.getNotificationMessage(
      date!,
      activityTitle,
      activityGroup,
      category,
    );

    date!.setSeconds(0);
    date!.setMilliseconds(0);

    if (isDaily) {
      const reminder = new Reminder();
      reminder.title = activityTitle;
      reminder.message = message;
      reminder.group = activityGroup;
      reminder.time = date!;

      await ReminderService.create(reminder);

      ReminderService.setPushNotification(
        message,
        activityGroup,
        date!,
        index,
        repeatType,
        1,
      );

      setHour(date!.getHours());
      setMinute(date!.getMinutes());
      defaultDate.setMinutes(date!.getMinutes());
      defaultDate.setHours(date!.getHours());
      defaultDate.setDate(date!.getDate());
      defaultDate.setMonth(date!.getMonth());
      setDefaultDate(defaultDate);
      setTimeNotSet(false);
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
  };

  const handleOnChangeMonthTime = (event: DateTimePickerEvent, date?: Date) => {
    const message = ReminderService.getNotificationMessage(
      date!,
      getTranslatedActivityTitle(reminderParams),
      activityGroup,
      category,
    );

    switch (event.type) {
      case 'set':
        let newReminder: ReminderStorage = {
          group: activityGroup,
          message,
          title: getTranslatedActivityTitle(reminderParams),
          hour: date!.getHours(),
          minute: date!.getMinutes(),
          date: date?.getDate(),
          day: date!.toLocaleDateString('en-US', {
            weekday: 'long',
          }),
          month: date?.getMonth(),
        };
        ReminderService.setPushNotification(
          message,
          activityGroup,
          date!,
          index,
          repeatType,
          repeatTime,
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
        setTimeNotSet(false);
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
    if (timeNotSet) {
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
      onPress={() => handleOnPressShowTimePicker(activityLabel)}>
      {timeNotSet ? (
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
