import React, {useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
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
import {ActivityService} from '../services/ActivityService';
import Button from '../components/Button';
import {ActivityCategory, FilterType} from '../types/global';

const Home = ({navigation}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  const searchInputRef = useRef<TextInput | null>(null);

  const user = useAppSelector(state => state.user);

  const ACTIVITIES = [
    {
      icon: DailyActivitiesIconImg,
      activity: 'Daily Activities',
      screen: 'DailyActivities',
    },
    {
      icon: WeeklyActivitiesIconImg,
      activity: 'Weekly Activities',
      screen: 'WeeklyActivities',
    },
    {
      icon: MonthlyActivitiesIconImg,
      activity: 'Monthly Activities',
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

  const handleOnTestPress = async () => {
    console.log(
      'test clicked +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++',
    );

    // delete all activities
    // await ActivityService.deleteAll();
    await ActivityService.test();

    // const activities = await ActivityService.find();
    // console.log('activities', JSON.stringify(activities));

    console.log(
      'test operation ended --------------------------------------------------------------------------------------------------',
    );
  };

  return (
    <View style={globalStyles.container}>
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
            innerRef={searchInputRef}
            placeholder="Search activities here"
            style={styles.searchInput}
            onFocus={() => handleOnSearchInputFocus(true)}
            onEndEditing={() => handleOnSearchInputFocus(false)}
          />
        </View>
        <Pressable onPress={handleOnPressNotifications}>
          <NotificationIconImg style={styles.headerIcon} />
        </Pressable>
      </View>
      <ScrollView style={[globalStyles.container, styles.scrollView]}>
        <View style={styles.greetingContainer}>
          <Text style={styles.salam}>As salaamu alaekum</Text>
          <Text style={styles.name}>{user.name},</Text>
          {/* <Button text={'Test'} variant="solid" onPress={handleOnTestPress} /> */}
        </View>

        <View>
          <Image source={TipsImg} style={styles.banner} resizeMode="cover" />
        </View>

        <View style={styles.activities}>
          <Text style={styles.activitiesTitle}>Activities</Text>

          <View style={styles.activityList}>
            {ACTIVITIES.map((activity, index) => (
              <ActivityItem
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
    left: 20,
    zIndex: 2,
  },
  searchInput: {
    flexBasis: '80%',
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
