import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GlobalColors} from '../styles/global';
import Profile from '../screens/Profile';
import EvaluationList from '../screens/EvaluationList';
import {ActivityCategory, FilterType} from '../types/global';
import DailyEvaluation from '../screens/DailyEvaluation';
import {capitalizeFirstLetter} from '../utils/global';
import PeriodicEvaluation from '../screens/PeriodicEvaluation';
import Glossary from '../screens/Glossary';

export type ProfileNavigatorParamList = {
  Profile: undefined;
  EvaluationList: {category: Exclude<ActivityCategory, ActivityCategory.Solah>};
  DailyEvaluation: {activityGroup: string};
  PeriodicEvaluation: {
    activityGroup: string;
    category: ActivityCategory;
    filter: FilterType;
  };
  Glossary: undefined;
};

const Stack = createNativeStackNavigator<ProfileNavigatorParamList>();

const formatFilter = (filter: FilterType) => {
  const words = filter.split('_');

  return `${capitalizeFirstLetter(words[0])} ${
    words.length === 2 ? capitalizeFirstLetter(words[1]) : ''
  }`.trim();
};

const ProfileNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: 'Profile',
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="EvaluationList"
        component={EvaluationList}
        options={({route}) => ({
          headerTitle: `${route.params.category} Activities Evaluation`,
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="DailyEvaluation"
        component={DailyEvaluation}
        options={({route}) => ({
          headerTitle: `${route.params.activityGroup} (Today)`,
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="PeriodicEvaluation"
        component={PeriodicEvaluation}
        options={({route}) => ({
          headerTitle: `${route.params.activityGroup} (${formatFilter(
            route.params.filter,
          )})`,
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="Glossary"
        component={Glossary}
        options={{
          headerTitle: 'Glossary',
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  flatHeader: {
    backgroundColor: GlobalColors.background,
  },
});

export default ProfileNavigator;
