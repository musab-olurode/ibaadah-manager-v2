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
  resolveActivityDetails,
} from '../utils/activities';
import ReminderIconImg from '../assets/icons/reminder.png';
import {useTranslation} from 'react-i18next';

const RemindersList = ({
  route,
  navigation,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {category, apiSolah} =
    route.params as RootNavigatorParamList['RemindersList'];
  const {t} = useTranslation();
  const handleOnPressItem = (activity: string) => {
    navigation.push('RemindersSettings', {activity, category, apiSolah});
  };
  // apiSolah.Fajr && console.log(apiSolah);
  return (
    <ScrollView style={globalStyles.container}>
      <View>
        {category === 'Daily' && (
          <View>
            <ActivityItem
              hideStartIcon
              activity={t('common:solah')}
              style={styles.activityItem}
              showEndIcon
              customEndIcon={
                <Image style={styles.bellIcon} source={ReminderIconImg} />
              }
              onPress={() => handleOnPressItem(t('common:solah'))}
            />
            {DAILY_ACTIVITIES.map((activity, index) => (
              <ActivityItem
                key={index}
                hideStartIcon
                activity={resolveActivityDetails(activity.group, t)}
                style={styles.activityItem}
                showEndIcon
                customEndIcon={
                  <Image style={styles.bellIcon} source={ReminderIconImg} />
                }
                onPress={() =>
                  handleOnPressItem(resolveActivityDetails(activity.group, t))
                }
              />
            ))}
          </View>
        )}
        {category === 'Weekly' && (
          <View>
            {WEEKLY_ACTIVITIES.map((activity, index) => (
              <ActivityItem
                key={index}
                hideStartIcon
                activity={resolveActivityDetails(activity.group, t)}
                style={styles.activityItem}
                showEndIcon
                customEndIcon={
                  <Image style={styles.bellIcon} source={ReminderIconImg} />
                }
                onPress={() =>
                  handleOnPressItem(resolveActivityDetails(activity.group, t))
                }
              />
            ))}
          </View>
        )}
        {category === 'Monthly' && (
          <View>
            {MONTHLY_ACTIVITIES.map((activity, index) => (
              <ActivityItem
                key={index}
                hideStartIcon
                activity={resolveActivityDetails(activity.group, t)}
                style={styles.activityItem}
                showEndIcon
                customEndIcon={
                  <Image style={styles.bellIcon} source={ReminderIconImg} />
                }
                onPress={() =>
                  handleOnPressItem(resolveActivityDetails(activity.group, t))
                }
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
