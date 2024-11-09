import React from 'react';
import {StyleSheet, Text, ScrollView, View} from 'react-native';
import ActivityItem from '../components/ActivityItem';
import {globalStyles, normalizeFont} from '../styles/global';
import DailyActivitiesIconImg from '../assets/icons/daily-activities.png';
import WeeklyActivitiesIconImg from '../assets/icons/weekly-activities.png';
import MonthlyActivitiesIconImg from '../assets/icons/monthly-activities.png';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {ActivityCategory, Theme} from '../types/global';
import usePreferredTheme from '../hooks/usePreferredTheme';
import {useTranslation} from 'react-i18next';

const Reminders = ({
  navigation,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {t} = useTranslation();
  const preferredTheme = usePreferredTheme();

  const handleOnActivityGroup = (
    category: RootNavigatorParamList['RemindersList']['category'],
  ) => {
    navigation.push('RemindersList', {category});
  };

  const ACTIONS = [
    {
      icon: DailyActivitiesIconImg,
      name: t('common:dailyActivitiesTitle'),
      onPress: () => handleOnActivityGroup(ActivityCategory.Daily),
    },
    {
      icon: WeeklyActivitiesIconImg,
      name: t('common:weeklyActivitiesTitle'),
      onPress: () => handleOnActivityGroup(ActivityCategory.Weekly),
    },
    {
      icon: MonthlyActivitiesIconImg,
      name: t('common:monthlyActivitiesTitle'),
      onPress: () => handleOnActivityGroup(ActivityCategory.Monthly),
    },
  ];

  return (
    <ScrollView
      style={[
        globalStyles.container,
        preferredTheme === Theme.DARK && globalStyles.darkModeContainer,
      ]}>
      <Text
        style={[
          styles.header,
          preferredTheme === Theme.DARK && globalStyles.darkModeText,
        ]}>
        Set reminders for activities
      </Text>
      <View>
        {ACTIONS.map((action, index) => (
          <ActivityItem
            isDarkMode={preferredTheme === Theme.DARK}
            key={index}
            icon={action.icon}
            title={action.name}
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
