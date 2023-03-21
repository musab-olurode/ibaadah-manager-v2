import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RNBootSplash from 'react-native-bootsplash';
import Home from '../screens/Home';
import Onboarding from '../screens/Onboarding';
import DailyActivities from '../screens/DailyActivities';
import {GlobalColors} from '../styles/global';
import Solah from '../screens/Solah';
import WeeklyActivities from '../screens/WeeklyActivities';
import MonthlyActivities from '../screens/MonthlyActivities';
import ManageActivities from '../screens/ManageActivities';
import ProfileNavigator from './ProfileNavigator';
import Reminders from '../screens/Reminders';
import RemindersList from '../screens/RemindersList';
import RemindersSettings from '../screens/RemindersSettings';
import {getOnboardingState} from '../utils/onboarding';
import {getUser} from '../utils/storage';
import {setUserDetails} from '../redux/user/userSlice';
import {useAppDispatch} from '../redux/hooks';
import {synchronizeActivities} from '../utils/activities';
import {connectDB} from '../database/config';

export type RootNavigatorParamList = {
  Onboarding: undefined;
  Home: undefined;
  DailyActivities: undefined;
  Solah: undefined;
  WeeklyActivities: undefined;
  MonthlyActivities: undefined;
  ManageActivities: {category: 'Daily' | 'Weekly' | 'Monthly'};
  ProfileNavigator: undefined;
  Reminders: undefined;
  RemindersList: {category: 'Daily' | 'Weekly' | 'Monthly'};
  RemindersSettings: {
    activity: string;
    category: 'Daily' | 'Weekly' | 'Monthly' | 'Solah';
  };
};

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const populateUserInState = async () => {
    const user = await getUser();
    dispatch(setUserDetails(user));
  };

  const handleAppStart = async () => {
    await connectDB();
    const hasOnboarded = await getOnboardingState();

    if (hasOnboarded === 'true') {
      await populateUserInState();
      setShowOnboarding(false);
      await synchronizeActivities();
    }

    RNBootSplash.hide({fade: true});
  };

  useEffect(() => {
    handleAppStart();
  }, []);

  return (
    <Stack.Navigator>
      {showOnboarding && (
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{headerShown: false}}
        />
      )}
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DailyActivities"
        component={DailyActivities}
        options={{
          headerTitle: 'Daily Activities',
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Solah"
        component={Solah}
        options={{
          headerTitle: 'Solah',
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="WeeklyActivities"
        component={WeeklyActivities}
        options={{
          headerTitle: 'Weekly Activities',
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="MonthlyActivities"
        component={MonthlyActivities}
        options={{
          headerTitle: 'Monthly Activities',
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="ManageActivities"
        component={ManageActivities}
        options={{
          headerTitle: 'Add/Remove Activities',
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Reminders"
        component={Reminders}
        options={{
          headerTitle: 'Reminders',
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="RemindersList"
        component={RemindersList}
        options={({route}) => ({
          headerTitle: `${route.params.category} Activities`,
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="RemindersSettings"
        component={RemindersSettings}
        options={({route}) => ({
          headerTitle: `${route.params.activity}`,
          headerStyle: styles.flatHeader,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  flatHeader: {
    backgroundColor: GlobalColors.background,
  },
});

export default RootNavigator;
