import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StyleSheet, View, ScrollView, Image} from 'react-native';
import ActivityItem from '../components/ActivityItem';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {globalStyles} from '../styles/global';
import {
  DAILY_ACTIVITIES,
  MONTHLY_ACTIVITIES,
  WEEKLY_ACTIVITIES,
} from '../utils/activities';
import ReminderIconImg from '../assets/icons/reminder.png';
import usePreferredTheme from '../hooks/usePreferredTheme';
import {Theme} from '../types/global';

const RemindersList = ({
  route,
  navigation,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {category} = route.params as RootNavigatorParamList['RemindersList'];
  const preferredTheme = usePreferredTheme();

  const handleOnPressItem = (activity: string) => {
    navigation.push('RemindersSettings', {activity});
  };

  return (
    <ScrollView
      style={[
        globalStyles.container,
        preferredTheme === Theme.DARK && globalStyles.darkModeContainer,
      ]}>
      <View>
        {category === 'Daily' && (
          <View>
            <ActivityItem
              isDarkMode={preferredTheme === Theme.DARK}
              hideStartIcon
              activity="Solah"
              style={styles.activityItem}
              showEndIcon
              customEndIcon={
                <Image style={styles.bellIcon} source={ReminderIconImg} />
              }
              onPress={() => handleOnPressItem('Solah')}
            />
            {DAILY_ACTIVITIES.map((activity, index) => (
              <ActivityItem
                isDarkMode={preferredTheme === Theme.DARK}
                key={index}
                hideStartIcon
                activity={activity.group}
                style={styles.activityItem}
                showEndIcon
                customEndIcon={
                  <Image style={styles.bellIcon} source={ReminderIconImg} />
                }
                onPress={() => handleOnPressItem(activity.group)}
              />
            ))}
          </View>
        )}
        {category === 'Weekly' && (
          <View>
            {WEEKLY_ACTIVITIES.map((activity, index) => (
              <ActivityItem
                key={index}
                isDarkMode={preferredTheme === Theme.DARK}
                hideStartIcon
                activity={activity.group}
                style={styles.activityItem}
                showEndIcon
                customEndIcon={
                  <Image style={styles.bellIcon} source={ReminderIconImg} />
                }
                onPress={() => handleOnPressItem(activity.group)}
              />
            ))}
          </View>
        )}
        {category === 'Monthly' && (
          <View>
            {MONTHLY_ACTIVITIES.map((activity, index) => (
              <ActivityItem
                key={index}
                isDarkMode={preferredTheme === Theme.DARK}
                hideStartIcon
                activity={activity.group}
                style={styles.activityItem}
                showEndIcon
                customEndIcon={
                  <Image style={styles.bellIcon} source={ReminderIconImg} />
                }
                onPress={() => handleOnPressItem(activity.group)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    marginBottom: 24,
  },
  bellIcon: {
    width: 40,
    height: 40,
  },
});

export default RemindersList;
