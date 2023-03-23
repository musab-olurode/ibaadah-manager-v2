import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StyleSheet, View, ScrollView} from 'react-native';
import ActivityItem from '../components/ActivityItem';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {globalStyles} from '../styles/global';
import {
  DAILY_ACTIVITIES,
  MONTHLY_ACTIVITIES,
  SOLAH,
  WEEKLY_ACTIVITIES,
} from '../utils/activities';

import {StorageKeys} from '../types/global';
import {ClockButton} from '../components/ClockButton';

const RemindersSettings = ({
  route,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {activity, category} =
    route.params as RootNavigatorParamList['RemindersSettings'];
  let All_ACTIVITIES;
  let filteredReminder: string;
  let uniqueId: number;
  let repeatType: 'day' | 'week' | 'time';
  if (category === 'Daily') {
    All_ACTIVITIES = DAILY_ACTIVITIES;
    filteredReminder = StorageKeys.DAILY_REMINDER;
    repeatType = 'day';
    uniqueId = 11;
  } else if (category === 'Weekly') {
    All_ACTIVITIES = WEEKLY_ACTIVITIES;
    filteredReminder = StorageKeys.WEEKLY_REMINDER;
    repeatType = 'week';
    uniqueId = 22;
  } else if (category === 'Monthly') {
    All_ACTIVITIES = MONTHLY_ACTIVITIES;
    filteredReminder = StorageKeys.MONTHLY_REMINDER;
    repeatType = 'time';
    uniqueId = 33;
  } else {
    All_ACTIVITIES = MONTHLY_ACTIVITIES;
    repeatType = 'time';
  }
  const filteredActivity = All_ACTIVITIES.filter(i => i.group === activity);
  return (
    <ScrollView style={globalStyles.container}>
      <View>
        {activity === 'Solah'
          ? SOLAH.map((action, index) => (
              <ActivityItem
                key={index}
                hideStartIcon
                activity={action.group}
                style={styles.activityItem}
                showEndIcon
                customEndIcon={
                  <ClockButton
                    action={action}
                    activity={activity}
                    route={route}
                    index={index}
                    category={category}
                    filteredReminder={filteredReminder}
                    repeatType={repeatType}
                    uniqueId={uniqueId}
                    actionId={action.icon}
                  />
                }
              />
            ))
          : filteredActivity.map(action =>
              action.activities.map((content, index) => (
                <ActivityItem
                  key={index}
                  hideStartIcon
                  activity={content.title}
                  style={styles.activityItem}
                  showEndIcon
                  customEndIcon={
                    <ClockButton
                      action={content}
                      activity={activity}
                      route={route}
                      index={index}
                      category={category}
                      filteredReminder={filteredReminder}
                      repeatType={repeatType}
                      uniqueId={uniqueId}
                      actionId={action.icon}
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
});

export default RemindersSettings;
