import React, {useState, useRef, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  Dimensions,
  ViewStyle,
} from 'react-native';
import {
  GlobalColors,
  globalFonts,
  globalStyles,
  normalizeFont,
} from '../styles/global';
import AvatarSmImg from '../assets/avatar-sm.png';
import Input from '../components/Input';
import NotificationIconImg from '../assets/icons/notification.svg';
import SearchIconImg from '../assets/icons/search.svg';
import TipsImg from '../assets/tips.png';
import ActivityItem from '../components/ActivityItem';
import DailyActivitiesIconImg from '../assets/icons/daily-activities.png';
import WeeklyActivitiesIconImg from '../assets/icons/weekly-activities.png';
import MonthlyActivitiesIconImg from '../assets/icons/monthly-activities.png';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAppSelector} from '../redux/hooks';
import {Theme} from '../types/global';
import {useTranslation} from 'react-i18next';
import usePreferredTheme from '../hooks/usePreferredTheme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const HEADER_HORIZONTAL_SPACING = 120;

const Home = ({navigation}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  const searchInputRef = useRef<TextInput | null>(null);
  const {t} = useTranslation();
  const {user} = useAppSelector(state => state);

  const preferredTheme = usePreferredTheme();

  const ACTIVITIES = [
    {
      icon: DailyActivitiesIconImg,
      activity: t('common:dailyActivitiesTitle'),
      screen: 'DailyActivities',
    },
    {
      icon: WeeklyActivitiesIconImg,
      activity: t('common:weeklyActivitiesTitle'),
      screen: 'WeeklyActivities',
    },
    {
      icon: MonthlyActivitiesIconImg,
      activity: t('common:monthlyActivitiesTitle'),
      screen: 'MonthlyActivities',
    },
  ];

  const handleOnPressSearchInputIcon = () => {
    searchInputRef.current?.focus();
  };

  const handleOnSearchInputFocus = (isFocused: boolean) => {
    setIsSearchInputFocused(isFocused);
  };

  const handleOnPressGoToActivity = (screen: keyof RootNavigatorParamList) => {
    navigation.push(screen);
  };

  const handleOnPressProfileAvatar = () => {
    navigation.navigate('ProfileNavigator');
  };

  const handleOnPressNotifications = () => {
    navigation.navigate('Reminders');
  };

  useEffect(() => {
    // dispatch(showLoading());
  }, []);

  return (
    <View
      style={[
        globalStyles.container,
        preferredTheme === Theme.DARK && globalStyles.darkModeContainer,
      ]}>
      <View style={styles.header}>
        <Pressable onPress={handleOnPressProfileAvatar}>
          <Image
            resizeMode="contain"
            source={
              user.avatarPath ? {uri: `file://${user.avatarPath}`} : AvatarSmImg
            }
            style={styles.headerIcon}
          />
        </Pressable>
        <View style={styles.searchInputContainer}>
          {!isSearchInputFocused && (
            <Pressable
              style={styles.searchInputIcon}
              onPress={handleOnPressSearchInputIcon}>
              <SearchIconImg />
            </Pressable>
          )}
          <Input
            isDarkMode={preferredTheme === Theme.DARK}
            innerRef={searchInputRef}
            placeholder={t('common:searchActivitiesPlaceholder') as string}
            style={styles.searchInput}
            onFocus={() => handleOnSearchInputFocus(true)}
            onEndEditing={() => handleOnSearchInputFocus(false)}
          />
        </View>
        <Pressable
          style={styles.notificationIconPressable}
          onPress={handleOnPressNotifications}>
          <NotificationIconImg
            style={[
              styles.headerIcon,
              preferredTheme === Theme.DARK &&
                (globalStyles.darkModeText as ViewStyle),
            ]}
          />
        </Pressable>
      </View>
      <ScrollView
        style={[
          globalStyles.container,
          styles.scrollView,
          preferredTheme === Theme.DARK && globalStyles.darkModeContainer,
        ]}>
        <View style={styles.greetingContainer}>
          <Text style={styles.salam}>{t('common:salam')}</Text>
          <Text
            style={[
              styles.name,
              preferredTheme === Theme.DARK && globalStyles.darkModeText,
            ]}>
            {user.name},
          </Text>
          {/* <Button text={'Test'} variant="solid" onPress={handleOnTestPress} /> */}
        </View>

        <View>
          <Image source={TipsImg} style={styles.banner} resizeMode="cover" />
        </View>

        <View style={styles.activities}>
          <Text
            style={[
              styles.activitiesTitle,
              preferredTheme === Theme.DARK && globalStyles.darkModeText,
            ]}>
            {t('common:activitiesTitle')}
          </Text>

          <View style={styles.activityList}>
            {ACTIVITIES.map((activity, index) => (
              <ActivityItem
                isDarkMode={preferredTheme === Theme.DARK}
                key={index}
                style={styles.activity}
                {...activity}
                onPress={() =>
                  handleOnPressGoToActivity(
                    activity.screen as keyof RootNavigatorParamList,
                  )
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    borderRadius: 100,
    height: 40,
    width: 40,
    color: GlobalColors.gray,
  },
  notificationIconPressable: {
    marginRight: 4,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 13,
    flexGrow: 1,
    position: 'relative',
  },
  searchInputIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 2,
  },
  searchInput: {
    width: SCREEN_WIDTH - HEADER_HORIZONTAL_SPACING,
    paddingLeft: 40,
    height: 40,
  },
  scrollView: {
    padding: 0,
  },
  greetingContainer: {
    marginTop: 14,
  },
  salam: {
    fontSize: normalizeFont(28),
    color: GlobalColors.primary,
    ...globalFonts.spaceGrotesk.bold,
  },
  name: {
    ...globalStyles.text,
    fontSize: normalizeFont(20),
    color: GlobalColors.gray,
    ...globalFonts.aeonik.regular,
  },
  banner: {
    marginTop: 32,
    borderRadius: 8,
    width: '100%',
  },
  activities: {
    marginTop: 42,
  },
  activitiesTitle: {
    ...globalStyles.text,
    fontSize: normalizeFont(24),
    ...globalFonts.spaceGrotesk.medium,
  },
  activityList: {
    marginTop: 24,
  },
  activity: {
    marginBottom: 24,
  },
});

export default Home;
