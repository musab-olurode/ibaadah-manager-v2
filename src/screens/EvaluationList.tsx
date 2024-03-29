import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, ScrollView, View, StyleProp, ViewStyle} from 'react-native';
import {globalStyles} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import {Select} from 'native-base';
import {ActivityCategory, FilterType, Theme} from '../types/global';
import FilterIconImg from '../assets/icons/filter.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileNavigatorParamList} from '../navigators/ProfileNavigator';
import SolahIconImg from '../assets/icons/solah.png';
import {
  DAILY_ACTIVITIES,
  MONTHLY_ACTIVITIES,
  resolveActivityDetails,
  WEEKLY_ACTIVITIES,
} from '../utils/activities';
import {getEndOfLastWeek} from '../utils/global';
import {useAppSelector} from '../redux/hooks';
import {ActivityService} from '../services/ActivityService';
import {useTranslation} from 'react-i18next';
import usePreferredTheme from '../hooks/usePreferredTheme';

const EvaluationList = ({
  route,
  navigation,
}: NativeStackScreenProps<ProfileNavigatorParamList>) => {
  const {category} =
    route.params as ProfileNavigatorParamList['EvaluationList'];
  const [filter, setFilter] = useState(FilterType.TODAY);
  const [separatedActivities, setSeparatedActivities] = useState({
    daily: DAILY_ACTIVITIES,
    weekly: WEEKLY_ACTIVITIES,
    monthly: MONTHLY_ACTIVITIES,
  });
  const {t} = useTranslation();
  const preferredTheme = usePreferredTheme();

  const globalActivity = useAppSelector(state => state.activity);
  const endOfLastWeek = getEndOfLastWeek();

  const handleOnSelectFilter = (value: string) => {
    setFilter(value as FilterType);
  };

  const handleOnPressItem = (activity: string) => {
    switch (filter) {
      case FilterType.TODAY:
        navigation.push('DailyEvaluation', {activityGroup: activity});
        break;
      default:
        navigation.push('PeriodicEvaluation', {
          activityGroup: activity,
          filter,
          category: activity === 'Solah' ? ActivityCategory.Solah : category,
        });
        break;
    }
  };

  const shouldDisableTodayFilter = () => {
    if (
      category === ActivityCategory.Monthly ||
      category === ActivityCategory.Weekly
    ) {
      return true;
    } else {
      return false;
    }
  };

  const shouldDisableThisWeekFilter = () => {
    if (category === ActivityCategory.Monthly) {
      return true;
    } else {
      return false;
    }
  };

  const shouldDisableLastWeekFilter = () => {
    if (new Date(globalActivity.firstDay) > endOfLastWeek) {
      return true;
    } else if (category === ActivityCategory.Monthly) {
      return true;
    } else {
      return false;
    }
  };

  const getDefaultSelectedFilter = useCallback(() => {
    let _filter: FilterType;
    if (category === ActivityCategory.Daily) {
      _filter = FilterType.TODAY;
    } else if (category === ActivityCategory.Weekly) {
      _filter = FilterType.THIS_WEEK;
    } else {
      _filter = FilterType.MONTHLY;
    }
    setFilter(_filter);
  }, [category]);

  const checkCustomActivities = async () => {
    const CUSTOM_GROUP = 'Custom';
    const customDailyActivityCount =
      await ActivityService.getCustomActivityCount(ActivityCategory.Daily);
    const customWeeklyActivityCount =
      await ActivityService.getCustomActivityCount(ActivityCategory.Weekly);
    const customMonthlyActivityCount =
      await ActivityService.getCustomActivityCount(ActivityCategory.Monthly);

    let dailyActivities = DAILY_ACTIVITIES,
      weeklyActivities = WEEKLY_ACTIVITIES,
      monthlyActivities = MONTHLY_ACTIVITIES;

    if (customDailyActivityCount === 0) {
      dailyActivities = DAILY_ACTIVITIES.filter(
        activity => activity.group !== CUSTOM_GROUP,
      );
    }
    if (customWeeklyActivityCount === 0) {
      weeklyActivities = WEEKLY_ACTIVITIES.filter(
        activity => activity.group !== CUSTOM_GROUP,
      );
    }
    if (customMonthlyActivityCount === 0) {
      monthlyActivities = MONTHLY_ACTIVITIES.filter(
        activity => activity.group !== CUSTOM_GROUP,
      );
    }
    setSeparatedActivities({
      daily: dailyActivities,
      weekly: weeklyActivities,
      monthly: monthlyActivities,
    });
  };

  useEffect(() => {
    getDefaultSelectedFilter();
    checkCustomActivities();
  }, [getDefaultSelectedFilter]);

  return (
    <>
      <View
        style={preferredTheme === Theme.DARK && globalStyles.darkModeContainer}>
        <View
          style={[
            styles.header,
            preferredTheme === Theme.DARK && globalStyles.darkModeOverlay,
          ]}>
          <Select
            variant="unstyled"
            style={[
              styles.filter as StyleProp<ViewStyle>,
              preferredTheme === Theme.DARK && globalStyles.darkModeOverlay,
              preferredTheme === Theme.DARK &&
                (globalStyles.darkModeText as ViewStyle),
            ]}
            dropdownIcon={
              <FilterIconImg
                style={[
                  styles.filterIcon,
                  preferredTheme === Theme.DARK &&
                    (globalStyles.darkModeText as ViewStyle),
                ]}
              />
            }
            selectedValue={filter}
            accessibilityLabel={t('common:chooseFilter') as string}
            placeholder={t('common:chooseFilter') as string}
            onValueChange={handleOnSelectFilter}>
            <Select.Item
              label={t('common:today')}
              value={FilterType.TODAY}
              disabled={shouldDisableTodayFilter()}
            />
            <Select.Item
              label={t('common:thisWeek')}
              value={FilterType.THIS_WEEK}
              disabled={shouldDisableThisWeekFilter()}
            />
            <Select.Item
              label={t('common:lastWeek')}
              value={FilterType.LAST_WEEK}
              disabled={shouldDisableLastWeekFilter()}
            />
            <Select.Item
              label={t('common:monthly')}
              value={FilterType.MONTHLY}
            />
          </Select>
        </View>
      </View>

      <ScrollView
        style={[
          globalStyles.container,
          preferredTheme === Theme.DARK && globalStyles.darkModeContainer,
        ]}
        contentContainerStyle={styles.scrollContainer}>
        <View>
          {category === 'Daily' && (
            <View>
              <ActivityItem
                isDarkMode={preferredTheme === Theme.DARK}
                icon={SolahIconImg}
                activity={t('common:solah')}
                style={styles.activityItem}
                onPress={() => handleOnPressItem('Solah')}
              />
              {separatedActivities.daily.map((activity, index) => (
                <ActivityItem
                  isDarkMode={preferredTheme === Theme.DARK}
                  key={index}
                  icon={activity.icon}
                  activity={resolveActivityDetails(activity.group, t)}
                  style={styles.activityItem}
                  onPress={() => handleOnPressItem(activity.group)}
                />
              ))}
            </View>
          )}
          {category === 'Weekly' && (
            <View>
              {separatedActivities.weekly.map((activity, index) => (
                <ActivityItem
                  isDarkMode={preferredTheme === Theme.DARK}
                  key={index}
                  icon={activity.icon}
                  activity={resolveActivityDetails(activity.group, t)}
                  style={styles.activityItem}
                  onPress={() => handleOnPressItem(activity.group)}
                />
              ))}
            </View>
          )}
          {category === 'Monthly' && (
            <View>
              {separatedActivities.monthly.map((activity, index) => (
                <ActivityItem
                  key={index}
                  icon={activity.icon}
                  activity={resolveActivityDetails(activity.group, t)}
                  style={styles.activityItem}
                  onPress={() => handleOnPressItem(activity.group)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 15,
  },
  activityItem: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 1,
    borderColor: '#BBDACE',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 16,
  },
  filter: {
    ...globalStyles.text,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  filterIcon: {
    marginRight: 16,
    color: '#505050',
  },
});

export default EvaluationList;
