import React, {useEffect} from 'react';
import {StyleSheet, Text, ScrollView, View} from 'react-native';
import ActivityItem from '../components/ActivityItem';
import {globalStyles, normalizeFont} from '../styles/global';
import DailyActivitiesIconImg from '../assets/icons/daily-activities.png';
import WeeklyActivitiesIconImg from '../assets/icons/weekly-activities.png';
import MonthlyActivitiesIconImg from '../assets/icons/monthly-activities.png';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {createChannel} from '../utils/notificationService';

const Reminders = ({
  navigation,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const ACTIONS = [
    {
      icon: DailyActivitiesIconImg,
      name: 'Daily Activities',
      onPress: () => handleOnActivityGroup('Daily'),
    },
    {
      icon: WeeklyActivitiesIconImg,
      name: 'Weekly Activities',
      onPress: () => handleOnActivityGroup('Weekly'),
    },
    {
      icon: MonthlyActivitiesIconImg,
      name: 'Monthly Activities',
      onPress: () => handleOnActivityGroup('Monthly'),
    },
  ];
  useEffect(() => {
    createChannel();
  }, []);

  function handleOnActivityGroup(
    category: RootNavigatorParamList['RemindersList']['category'],
  ) {
    navigation.push('RemindersList', {category});
  }
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={styles.header}>Set reminders for activities</Text>
      <View>
        {ACTIONS.map((action, index) => (
          <ActivityItem
            key={index}
            icon={action.icon}
            activity={action.name}
            style={styles.activityItem}
            onPress={action.onPress}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    ...globalStyles.text,
    fontWeight: '500',
    fontSize: normalizeFont(20),
    marginBottom: 24,
  },
  activityItem: {
    marginBottom: 24,
  },
});

export default Reminders;
