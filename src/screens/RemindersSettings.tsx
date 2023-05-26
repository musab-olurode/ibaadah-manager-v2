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
  resolveActivityDetails,
} from '../utils/activities';

import {StorageKeys} from '../types/global';
import {ClockButton} from '../components/ClockButton';
import {useTranslation} from 'react-i18next';

const RemindersSettings = ({
  route,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {activity, category, apiSolah} =
    route.params as RootNavigatorParamList['RemindersSettings'];
  let All_ACTIVITIES;
  let reminderKeyInDb: string;
  let uniqueId: number;
  let repeatType: 'day' | 'week' | 'time' = 'day';
  const {t} = useTranslation();
  if (category === 'Daily') {
    All_ACTIVITIES = DAILY_ACTIVITIES;
    reminderKeyInDb = StorageKeys.DAILY_REMINDER;
    uniqueId = 11;
  } else if (category === 'Weekly') {
    All_ACTIVITIES = WEEKLY_ACTIVITIES;
    reminderKeyInDb = StorageKeys.WEEKLY_REMINDER;
    repeatType = 'week';
    uniqueId = 22;
  } else if (category === 'Monthly') {
    All_ACTIVITIES = MONTHLY_ACTIVITIES;
    reminderKeyInDb = StorageKeys.MONTHLY_REMINDER;
    uniqueId = 33;
  } else {
    All_ACTIVITIES = MONTHLY_ACTIVITIES;
    repeatType = 'day';
  }
  const filteredActivity = All_ACTIVITIES.filter(
    i => resolveActivityDetails(i.group, t) === activity,
  );

  return (
    <ScrollView style={globalStyles.container}>
      <View>
        {activity === t('common:solah')
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
                    index={index + uniqueId + action.icon}
                    category={category}
                    reminderKeyInDb={reminderKeyInDb}
                    repeatType={repeatType}
                    apiSolah={apiSolah}
                  />
                }
              />
            ))
          : filteredActivity.map(action =>
              action.activities.map((content, index) => (
                <ActivityItem
                  key={index}
                  hideStartIcon
                  activity={resolveActivityDetails(content.title, t)}
                  style={styles.activityItem}
                  showEndIcon
                  customEndIcon={
                    <ClockButton
                      action={content}
                      activity={activity}
                      route={route}
                      index={index + uniqueId + action.icon}
                      category={category}
                      reminderKeyInDb={reminderKeyInDb}
                      repeatType={repeatType}
                      apiSolah={apiSolah}
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
