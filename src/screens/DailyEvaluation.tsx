import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import DailyActivityEvaluationCard from '../components/DailyActivityEvaluationCard';
import {ProfileNavigatorParamList} from '../navigators/ProfileNavigator';
import {globalStyles} from '../styles/global';
import {SOLAH} from '../utils/activities';

const DailyEvaluation = ({
  route,
}: NativeStackScreenProps<ProfileNavigatorParamList>) => {
  const {activity} =
    route.params as ProfileNavigatorParamList['DailyEvaluation'];

  const formatDate = () => {
    return new Date().toDateString();
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={[globalStyles.text, styles.date]}>{formatDate()}</Text>

      {SOLAH.map((solah, index) => (
        <DailyActivityEvaluationCard
          key={`activity-${index}`}
          style={styles.card}
          activity={solah.title}
          actions={solah.content.map(action => ({
            name: action.activity,
            completed: true,
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
