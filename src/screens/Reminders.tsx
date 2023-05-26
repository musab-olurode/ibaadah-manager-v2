import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, ScrollView, View} from 'react-native';
import ActivityItem from '../components/ActivityItem';
import {globalStyles, normalizeFont} from '../styles/global';
import DailyActivitiesIconImg from '../assets/icons/daily-activities.png';
import WeeklyActivitiesIconImg from '../assets/icons/weekly-activities.png';
import MonthlyActivitiesIconImg from '../assets/icons/monthly-activities.png';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {createChannel, fetchSolatTimeAPI} from '../utils/notificationService';
import Geolocation from '@react-native-community/geolocation';
import {getApiReminderData, setApiReminderData} from '../utils/storage';
import {ActivityCategory} from '../types/global';

const Reminders = ({
  navigation,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const [apiSolah, setApiSolah] = useState({});

  const ACTIONS = [
    {
      icon: DailyActivitiesIconImg,
      name: 'Daily Activities',
      onPress: () => handleOnActivityGroup(ActivityCategory.Daily),
    },
    {
      icon: WeeklyActivitiesIconImg,
      name: 'Weekly Activities',
      onPress: () => handleOnActivityGroup(ActivityCategory.Weekly),
    },
    {
      icon: MonthlyActivitiesIconImg,
      name: 'Monthly Activities',
      onPress: () => handleOnActivityGroup(ActivityCategory.Monthly),
    },
  ];
  const fetchSolatTime = (
    latitude: number,
    longitude: number,
    dbApiData?: any,
  ) => {
    fetchSolatTimeAPI(latitude, longitude)
      .then(fetchedData => {
        const result = {
          ...fetchedData.data.timings,
          ...fetchedData.data.date,
          latitude: fetchedData.data.meta.latitude,
          longitude: fetchedData.data.meta.longitude,
        };
        setApiSolah(result);
        result && setApiReminderData(JSON.stringify(result));
      })
      .catch(err =>
        setApiSolah(
          dbApiData || {
            code: 404,
            message: err.message,
          },
        ),
      );
  };
  useEffect(() => {
    createChannel();
    getApiReminderData().then(data => {
      const dbApiData = JSON.parse(data!);

      console.log('Line before geolocation test for android 12');
      Geolocation.getCurrentPosition(i => {
        console.log('Android 12 location works');
        const latitude = i.coords.latitude;
        const longitude = i.coords.longitude;
        if (dbApiData) {
          Number(dbApiData.gregorian.day) !== new Date().getDate() ||
          Math.trunc(dbApiData.latitude) !== Math.trunc(latitude) ||
          Math.trunc(dbApiData.longitude) !== Math.trunc(longitude)
            ? fetchSolatTime(latitude, longitude, dbApiData)
            : setApiSolah(dbApiData);
        } else {
          fetchSolatTime(latitude, longitude);
        }
      });
    });
  }, []);

  function handleOnActivityGroup(
    category: RootNavigatorParamList['RemindersList']['category'],
  ) {
    navigation.push('RemindersList', {category, apiSolah});
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
