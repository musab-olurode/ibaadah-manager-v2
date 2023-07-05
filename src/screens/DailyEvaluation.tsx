import {useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, Text} from 'react-native';
import DailyActivityEvaluationCard from '../components/DailyActivityEvaluationCard';
import {ProfileNavigatorParamList} from '../navigators/ProfileNavigator';
import {ActivityService} from '../services/ActivityService';
import {globalFonts, globalStyles} from '../styles/global';
import {GroupedActivityEvaluation, Theme} from '../types/global';
import {resolveActivityDetails} from '../utils/activities';
import usePreferredTheme from '../hooks/usePreferredTheme';

const DailyEvaluation = ({
  route,
}: NativeStackScreenProps<ProfileNavigatorParamList>) => {
  const {activityGroup} =
    route.params as ProfileNavigatorParamList['DailyEvaluation'];
  const [dailyActivitiesEvaluation, setDailyActivitiesEvaluation] = useState<
    GroupedActivityEvaluation[]
  >([]);
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const preferredTheme = usePreferredTheme();

  const getCurrentDate = () => {
    return new Date().toDateString();
  };

  useEffect(() => {
    const getDailyActivities = async () => {
      const _dailyActivitiesEvaluation =
        await ActivityService.groupDailyEvaluation(activityGroup);
      setDailyActivitiesEvaluation(_dailyActivitiesEvaluation);
    };
    getDailyActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <ScrollView
      style={[
        globalStyles.container,
        preferredTheme === Theme.DARK && globalStyles.darkModeContainer,
      ]}>
      <Text
        style={[
          globalStyles.text,
          styles.date,
          preferredTheme === Theme.DARK && globalStyles.darkModeText,
        ]}>
        {getCurrentDate()}
      </Text>
      {dailyActivitiesEvaluation.map((activity, index) => (
        <DailyActivityEvaluationCard
          key={`activity-${index}`}
          isDarkMode={preferredTheme === Theme.DARK}
          style={styles.card}
          group={resolveActivityDetails(activity.group, t)}
          progress={activity.progress}
          activities={activity.activities}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  date: {
    ...globalFonts.aeonik.bold,
    marginBottom: 24,
  },
  card: {
    marginBottom: 24,
  },
});

export default DailyEvaluation;
