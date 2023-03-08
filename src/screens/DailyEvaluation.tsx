import {useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import DailyActivityEvaluationCard from '../components/DailyActivityEvaluationCard';
import {ProfileNavigatorParamList} from '../navigators/ProfileNavigator';
import {globalStyles} from '../styles/global';
import {GroupedActivityEvaluation} from '../types/global';
import {getActivitiesForCurrentDay, groupActivities} from '../utils/activities';

const DailyEvaluation = ({
  route,
}: NativeStackScreenProps<ProfileNavigatorParamList>) => {
  const {activity: activityTitle} =
    route.params as ProfileNavigatorParamList['DailyEvaluation'];
  const [dailyActivitiesEvaluation, setDailyActivitiesEvaluation] = useState<
    GroupedActivityEvaluation[]
  >([]);

  const isFocused = useIsFocused();

  const formatDate = () => {
    return new Date().toDateString();
  };

  useEffect(() => {
    const getDailyActivities = async () => {
      const allActivities = await getActivitiesForCurrentDay();
      const _dailyActivities = allActivities.data.filter(
        activity =>
          activity.title === activityTitle ||
          activity.category === activityTitle,
      );
      const groupedActivities = groupActivities(_dailyActivities);
      setDailyActivitiesEvaluation(groupedActivities);
    };
    getDailyActivities();
  }, [isFocused]);

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={[globalStyles.text, styles.date]}>{formatDate()}</Text>
      {dailyActivitiesEvaluation.map((activity, index) => (
        <DailyActivityEvaluationCard
          key={`activity-${index}`}
          style={styles.card}
          activity={activity.title}
          progress={activity.progress}
          actions={activity.content.map(action => ({
            name: action.activity,
            completed: action.completed,
          }))}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  date: {
    fontWeight: '500',
    marginBottom: 24,
  },
  card: {
    marginBottom: 24,
  },
});

export default DailyEvaluation;
