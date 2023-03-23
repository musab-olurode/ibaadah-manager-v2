import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RNBootSplash from 'react-native-bootsplash';
import Home from '../screens/Home';
import Onboarding from '../screens/Onboarding';
import DailyActivities from '../screens/DailyActivities';
import {GlobalColors, globalFonts} from '../styles/global';
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
import {connectDB} from '../database/config';
import {ActivityService} from '../services/ActivityService';
import {setGlobalActivityDetails} from '../redux/activity/activitySlice';
import {ActivityCategory} from '../types/global';
import EditCustomActivities from '../screens/EditCustomActivities';
import RemoveCustomActivities from '../screens/RemoveCustomActivities';
import {useTranslation} from 'react-i18next';
import {resolveActivityDetails} from '../utils/activities';

export type RootNavigatorParamList = {
  Onboarding: undefined;
  Home: undefined;
  DailyActivities: undefined;
  Solah: undefined;
  WeeklyActivities: undefined;
  MonthlyActivities: undefined;
  ManageActivities: {
    category: Exclude<ActivityCategory, ActivityCategory.Solah>;
  };
  EditCustomActivities: {
    category: Exclude<ActivityCategory, ActivityCategory.Solah>;
  };
  RemoveCustomActivities: {
    category: Exclude<ActivityCategory, ActivityCategory.Solah>;
  };
  ProfileNavigator: undefined;
  Reminders: undefined;
  RemindersList: {category: Exclude<ActivityCategory, ActivityCategory.Solah>};
  RemindersSettings: {activity: string};
};

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

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
    }

    await ActivityService.synchronizeActivities();
    const firstDayDate = await ActivityService.getFirstRecordedDay();
    dispatch(setGlobalActivityDetails({firstDay: firstDayDate}));

    RNBootSplash.hide({fade: true});
  };

  useEffect(() => {
    handleAppStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          headerTitle: t('common:dailyActivitiesTitle') as string,
          headerStyle: styles.flatHeader,
          headerTitleStyle: styles.flatHeaderText,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Solah"
        component={Solah}
        options={{
          headerTitle: t('common:solah') as string,
          headerStyle: styles.flatHeader,
          headerTitleStyle: styles.flatHeaderText,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="WeeklyActivities"
        component={WeeklyActivities}
        options={{
          headerTitle: t('common:weeklyActivitiesTitle') as string,
          headerStyle: styles.flatHeader,
          headerTitleStyle: styles.flatHeaderText,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="MonthlyActivities"
        component={MonthlyActivities}
        options={{
          headerTitle: t('common:monthlyActivitiesTitle') as string,
          headerStyle: styles.flatHeader,
          headerTitleStyle: styles.flatHeaderText,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="ManageActivities"
        component={ManageActivities}
        options={({route}) => ({
          headerTitle: t(
            `navigate:addRemove${route.params.category}Activities`,
          ) as string,
          headerStyle: styles.flatHeader,
          headerTitleStyle: styles.flatHeaderText,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="EditCustomActivities"
        component={EditCustomActivities}
        options={({route}) => ({
          headerTitle: t(
            `navigate:editCustom${route.params.category}Activities`,
          ) as string,
          headerStyle: styles.flatHeader,
          headerTitleStyle: styles.flatHeaderText,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="RemoveCustomActivities"
        component={RemoveCustomActivities}
        options={({route}) => ({
          headerTitle: t(
            `navigate:removeCustom${route.params.category}Activities`,
          ) as string,
          headerStyle: styles.flatHeader,
          headerTitleStyle: styles.flatHeaderText,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="Reminders"
        component={Reminders}
        options={{
          headerTitle: t('navigate:reminders') as string,
          headerStyle: styles.flatHeader,
          headerTitleStyle: styles.flatHeaderText,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="RemindersList"
        component={RemindersList}
        options={({route}) => ({
          headerTitle: t(
            `common:${route.params.category.toLowerCase()}ActivitiesTitle`,
          ) as string,
          headerStyle: styles.flatHeader,
          headerTitleStyle: styles.flatHeaderText,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="RemindersSettings"
        component={RemindersSettings}
        options={({route}) => ({
          headerTitle: resolveActivityDetails(route.params.activity, t),
          headerTitleStyle: styles.flatHeaderText,
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
  flatHeaderText: {
    ...globalFonts.spaceGrotesk.medium,
  },
});

export default RootNavigator;
