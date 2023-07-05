import React from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {GlobalColors, globalFonts} from '../styles/global';
import Profile from '../screens/Profile';
import EvaluationList from '../screens/EvaluationList';
import {ActivityCategory, FilterType, Theme} from '../types/global';
import DailyEvaluation from '../screens/DailyEvaluation';
import {capitalizeFirstLetter} from '../utils/global';
import PeriodicEvaluation from '../screens/PeriodicEvaluation';
import Glossary from '../screens/Glossary';
import {useTranslation} from 'react-i18next';
import {resolveActivityDetails} from '../utils/activities';
import SettingsIconImg from '../assets/icons/settings.png';
import Settings from '../screens/Settings';
import About from '../screens/About';
import {HeaderBackButton} from '@react-navigation/elements';
import usePreferredTheme from '../hooks/usePreferredTheme';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';

export type ProfileNavigatorParamList = {
  Profile: undefined;
  Settings: undefined;
  About: undefined;
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
  return `${words[0].toLowerCase()}${
    words.length === 2 ? capitalizeFirstLetter(words[1]) : ''
  }`.trim();
};

const ProfileNavigator = () => {
  const {t} = useTranslation();
  const preferredTheme = usePreferredTheme();

  const handleOnPressSettings = (
    navigation: NativeStackNavigationProp<
      ProfileNavigatorParamList,
      keyof ProfileNavigatorParamList,
      undefined
    >,
  ) => {
    navigation.push('Settings');
  };

  const profileHeaderRight = (
    navigation: NativeStackNavigationProp<
      ProfileNavigatorParamList,
      keyof ProfileNavigatorParamList,
      undefined
    >,
  ) => (
    <Pressable onPress={() => handleOnPressSettings(navigation)}>
      <Image style={styles.headerIcon} source={SettingsIconImg} />
    </Pressable>
  );

  const customHeader = (
    navigation: NativeStackNavigationProp<
      ProfileNavigatorParamList,
      keyof ProfileNavigatorParamList,
      undefined
    >,
    title: string,
    headerRight?: () => React.ReactElement,
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
    headerRight: headerRight,
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={({navigation}) =>
          customHeader(navigation, t('navigate:profile') as string, () =>
            profileHeaderRight(navigation),
          )
        }
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={({navigation}) =>
          customHeader(navigation, t('navigate:settings') as string)
        }
      />
      <Stack.Screen
        name="About"
        component={About}
        options={({navigation}) =>
          customHeader(navigation, t('navigate:about') as string)
        }
      />
      <Stack.Screen
        name="EvaluationList"
        component={EvaluationList}
        options={({route, navigation}) =>
          customHeader(
            navigation,
            t(
              `common:${route.params.category.toLowerCase()}ActivitiesEvaluation`,
            ) as string,
          )
        }
      />
      <Stack.Screen
        name="DailyEvaluation"
        component={DailyEvaluation}
        options={({route, navigation}) =>
          customHeader(
            navigation,
            `${resolveActivityDetails(route.params.activityGroup, t)} (${t(
              'common:today',
            )})`,
          )
        }
      />
      <Stack.Screen
        name="PeriodicEvaluation"
        component={PeriodicEvaluation}
        options={({route, navigation}) =>
          customHeader(
            navigation,
            `${resolveActivityDetails(route.params.activityGroup, t)} (${t(
              `common:${formatFilter(route.params.filter)}`,
            )})`,
          )
        }
      />
      <Stack.Screen
        name="Glossary"
        component={Glossary}
        options={({navigation}) =>
          customHeader(navigation, t('navigate:glossary') as string)
        }
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  flatHeader: {
    backgroundColor: GlobalColors.background,
  },
  darModeFlatHeader: {
    backgroundColor: GlobalColors.darkModeBackground,
  },
  headerIcon: {
    width: 40,
    height: 40,
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

export default ProfileNavigator;
