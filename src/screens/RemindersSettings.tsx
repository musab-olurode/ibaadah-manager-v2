import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import ActivityItem from '../components/ActivityItem';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {GlobalColors, globalStyles, normalizeFont} from '../styles/global';
import {
  DAILY_ACTIVITIES,
  MONTHLY_ACTIVITIES,
  SOLAH,
  WEEKLY_ACTIVITIES,
} from '../utils/activities';
import {Pressable} from 'native-base';
import ChevronDownIconImg from '../assets/icons/small-chevron-down.svg';
import {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setReminder} from '../utils/storage';
import {ReminderStorage, StorageKeys} from '../types/global';

const RemindersSettings = ({
  route,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {activity, category} =
    route.params as RootNavigatorParamList['RemindersSettings'];
  let All_ACTIVITIES;
  let filteredReminder: string;
  let repeatType: 'day' | 'week' | 'time';
  if (category === 'Daily') {
    All_ACTIVITIES = DAILY_ACTIVITIES;
    filteredReminder = StorageKeys.DAILY_REMINDER;
    repeatType = 'day';
  } else if (category === 'Weekly') {
    All_ACTIVITIES = WEEKLY_ACTIVITIES;
    filteredReminder = StorageKeys.WEEKLY_REMINDER;
    repeatType = 'week';
  } else if (category === 'Monthly') {
    All_ACTIVITIES = MONTHLY_ACTIVITIES;
    filteredReminder = StorageKeys.MONTHLY_REMINDER;
    repeatType = 'time';
  } else {
    All_ACTIVITIES = MONTHLY_ACTIVITIES;
    repeatType = 'time';
  }
  const filteredDailyActivity = All_ACTIVITIES.filter(
    i => i.title === activity,
  );
  return (
    <ScrollView style={globalStyles.container}>
      <View>
        {activity === 'Solah'
          ? SOLAH.map((action, index) => (
              <ActivityItem
                key={index}
                hideStartIcon
                activity={action.title}
                style={styles.activityItem}
                showEndIcon
                customEndIcon={
                  <ClockButton
                    action={action}
                    route={route}
                    index={index}
                    category={category}
                    filteredReminder={filteredReminder}
                    repeatType={repeatType}
                  />
                }
              />
            ))
          : filteredDailyActivity.map(action =>
              action.content.map((content, index) => (
                <ActivityItem
                  key={index}
                  hideStartIcon
                  activity={content.activity}
                  style={styles.activityItem}
                  showEndIcon
                  customEndIcon={
                    <ClockButton
                      action={content}
                      route={route}
                      index={index}
                      category={category}
                      filteredReminder={filteredReminder}
                      repeatType={repeatType}
                    />
                  }
                />
              )),
            )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    marginBottom: 24,
  },
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

export default RemindersSettings;

const ClockButton = ({
  action,
  route,
  index,
  category,
  filteredReminder,
  repeatType,
}: any) => {
  const [hour, setHour] = useState<number | undefined>(0);
  const [minute, setMinute] = useState<number | undefined>(0);

  let reminderParams: string;
  const {activity} =
    route.params as RootNavigatorParamList['RemindersSettings'];

  useEffect(() => {
    const getReminder = async () => {
      await AsyncStorage.getItem(filteredReminder).then(result => {
        const parsedResult: ReminderStorage[] = JSON.parse(result!);
        if (result) {
          let elementClicked: string;
          if (activity === 'Solah') {
            elementClicked = action.title;
          } else {
            elementClicked = action.activity;
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
      reminderParams = action.title;
    } else {
      reminderParams = action.activity;
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
          hour: date!.getHours(),
          minute: date!.getMinutes(),
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
