import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
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
import {getTheme, getUser, setTheme} from '../utils/storage';
import {setUserDetails} from '../redux/user/userSlice';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {connectDB} from '../database/config';
import {ActivityService} from '../services/ActivityService';
import {setGlobalActivityDetails} from '../redux/activity/activitySlice';
import {ActivityCategory, Theme} from '../types/global';
import EditCustomActivities from '../screens/EditCustomActivities';
import RemoveCustomActivities from '../screens/RemoveCustomActivities';
import {useTranslation} from 'react-i18next';
import {resolveActivityDetails} from '../utils/activities';
import {LoadingModal} from '../components/LoadingModal';
import {RootState} from '../redux/store';
import {setAppTheme} from '../redux/theme/themeSlice';
import usePreferredTheme from '../hooks/usePreferredTheme';
import {HeaderBackButton} from '@react-navigation/elements';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';

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
  const {loading} = useAppSelector<RootState>((state: RootState) => state);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const preferredTheme = usePreferredTheme();

  const populateUserInState = async () => {
    const user = await getUser();
    dispatch(setUserDetails(user));
  };

  const setupAppTheme = async () => {
    const theme = await getTheme();
    if (theme === null) {
      await setTheme(Theme.FOLLOW_SYSTEM);
      dispatch(setAppTheme(Theme.FOLLOW_SYSTEM));
    }
  };

  const handleAppStart = async () => {
    await connectDB();
    const hasOnboarded = await getOnboardingState();

    await setupAppTheme();

    if (hasOnboarded === 'true') {
      await populateUserInState();
      setShowOnboarding(false);
    }

    await ActivityService.synchronizeActivities();
    const firstDayDate = await ActivityService.getFirstRecordedDay();
    dispatch(setGlobalActivityDetails({firstDay: firstDayDate}));

    RNBootSplash.hide({fade: true});
  };

  const customHeader = (
    navigation: NativeStackNavigationProp<
      RootNavigatorParamList,
      keyof RootNavigatorParamList,
      undefined
    >,
    title: string,
  ) => ({
    headerTitle: title,
    headerStyle:
      preferredTheme === Theme.DARK
        ? styles.darModeFlatHeader
        : styles.flatHeader,
    headerTitleStyle:
      preferredTheme === Theme.DARK
        ? styles.darkModeFlatHeaderText
        : styles.flatHeaderText,
    headerLeft: (props: HeaderBackButtonProps) => (
      <HeaderBackButton
        {...props}
        pressColor={
          preferredTheme === Theme.DARK
            ? GlobalColors.darkModeBackPressColor
            : GlobalColors.backPressColor
        }
        tintColor={
          preferredTheme === Theme.DARK
            ? GlobalColors.darkModeTextColor
            : undefined
        }
        style={styles.backIconBtn}
        onPress={() => navigation.goBack()}
      />
    ),
    headerShadowVisible: false,
  });

  useEffect(() => {
    handleAppStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor={
          preferredTheme === Theme.DARK
            ? GlobalColors.darkModeBackground
            : GlobalColors.background
        }
        barStyle={
          preferredTheme === Theme.DARK ? 'light-content' : 'dark-content'
        }
      />
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
          options={({navigation}) =>
            customHeader(navigation, t('common:dailyActivitiesTitle') as string)
          }
        />
        <Stack.Screen
          name="Solah"
          component={Solah}
          options={({navigation}) =>
            customHeader(navigation, t('common:solah') as string)
          }
        />
        <Stack.Screen
          name="WeeklyActivities"
          component={WeeklyActivities}
          options={({navigation}) =>
            customHeader(
              navigation,
              t('common:weeklyActivitiesTitle') as string,
            )
          }
        />
        <Stack.Screen
          name="MonthlyActivities"
          component={MonthlyActivities}
          options={({navigation}) =>
            customHeader(
              navigation,
              t('common:monthlyActivitiesTitle') as string,
            )
          }
        />
        <Stack.Screen
          name="ManageActivities"
          component={ManageActivities}
          options={({route, navigation}) =>
            customHeader(
              navigation,
              t(
                `navigate:addRemove${route.params.category}Activities`,
              ) as string,
            )
          }
        />
        <Stack.Screen
          name="EditCustomActivities"
          component={EditCustomActivities}
          options={({route, navigation}) =>
            customHeader(
              navigation,
              t(
                `navigate:editCustom${route.params.category}Activities`,
              ) as string,
            )
          }
        />
        <Stack.Screen
          name="RemoveCustomActivities"
          component={RemoveCustomActivities}
          options={({route, navigation}) =>
            customHeader(
              navigation,
              t(
                `navigate:removeCustom${route.params.category}Activities`,
              ) as string,
            )
          }
        />
        <Stack.Screen
          name="Reminders"
          component={Reminders}
          options={({navigation}) =>
            customHeader(navigation, t('navigate:reminders') as string)
          }
        />
        <Stack.Screen
          name="RemindersList"
          component={RemindersList}
          options={({route, navigation}) =>
            customHeader(
              navigation,
              t(
                `common:${route.params.category.toLowerCase()}ActivitiesTitle`,
              ) as string,
            )
          }
        />
        <Stack.Screen
          name="RemindersSettings"
          component={RemindersSettings}
          options={({route, navigation}) =>
            customHeader(
              navigation,
              resolveActivityDetails(route.params.activity, t),
            )
          }
        />
        <Stack.Screen
          name="ProfileNavigator"
          component={ProfileNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      <LoadingModal isOpen={loading} />
    </>
  );
};

const styles = StyleSheet.create({
  flatHeader: {
    backgroundColor: GlobalColors.background,
  },
  darModeFlatHeader: {
    backgroundColor: GlobalColors.darkModeBackground,
  },
  backIconBtn: {
    marginRight: 25,
    marginLeft: 0,
  },
  flatHeaderText: {
    ...globalFonts.spaceGrotesk.medium,
  },
  darkModeFlatHeaderText: {
    ...globalFonts.spaceGrotesk.medium,
    color: GlobalColors.darkModeTextColor,
  },
});

export default RootNavigator;
