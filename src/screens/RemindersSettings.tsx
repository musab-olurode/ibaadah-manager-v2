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
  getTranslatedActivityTitle,
} from '../utils/activities';
import {ClockButton} from '../components/ClockButton';
import {useTranslation} from 'react-i18next';
import usePreferredTheme from '../hooks/usePreferredTheme';
import {Theme} from '../types/global';

const RemindersSettings = ({
  route,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {group, category} =
    route.params as RootNavigatorParamList['RemindersSettings'];
  const preferredTheme = usePreferredTheme();
  const {t} = useTranslation();

  console.log(group);

  let All_ACTIVITIES;
  let repeatType: 'day' | 'week' | 'time' = 'day';

  if (category === 'Daily') {
    All_ACTIVITIES = DAILY_ACTIVITIES;
  } else if (category === 'Weekly') {
    All_ACTIVITIES = WEEKLY_ACTIVITIES;
    repeatType = 'week';
  } else if (category === 'Monthly') {
    All_ACTIVITIES = MONTHLY_ACTIVITIES;
  } else {
    All_ACTIVITIES = MONTHLY_ACTIVITIES;
    repeatType = 'day';
  }

  const FILTERED_ACTIVITIES = All_ACTIVITIES.filter(
    i => getTranslatedActivityTitle(i.group) === group,
  );

  return (
    <ScrollView
      style={[
        globalStyles.container,
        preferredTheme === Theme.DARK && globalStyles.darkModeContainer,
      ]}>
      <View>
        {group === t('common:solah')
          ? SOLAH.map((action, index) => (
              <ActivityItem
                key={index}
                isDarkMode={preferredTheme === Theme.DARK}
                hideStartIcon
                title={action.group}
                style={styles.activityItem}
                showEndIcon
                customEndIcon={
                  <ClockButton
                    activityLabel={action.group}
                    activityGroup={group}
                    category={category}
                    repeatType={repeatType}
                    reminderKeyInDb={''}
                    index={0}
                  />
                }
              />
            ))
          : FILTERED_ACTIVITIES.map(filteredActivity =>
              filteredActivity.activities.map((groupActivity, index) => (
                <ActivityItem
                  isDarkMode={preferredTheme === Theme.DARK}
                  key={index}
                  hideStartIcon
                  title={getTranslatedActivityTitle(groupActivity.title)}
                  style={styles.activityItem}
                  showEndIcon
                  customEndIcon={
                    <ClockButton
                      activityLabel={groupActivity.title}
                      activityGroup={group}
                      category={category}
                      repeatType={repeatType}
                      index={0}
                      reminderKeyInDb={''}
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
