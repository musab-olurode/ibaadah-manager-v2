import React, {useState} from 'react';
import {StyleSheet, ScrollView, View, StyleProp, ViewStyle} from 'react-native';
import {globalStyles} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import {Select} from 'native-base';
import {FilterType} from '../types/global';
import FilterIconImg from '../assets/icons/filter.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileNavigatorParamList} from '../navigators/ProfileNavigator';
import SolahIconImg from '../assets/icons/solah.png';
import {
  DAILY_ACTIVITIES,
  MONTHLY_ACTIVITIES,
  WEEKLY_ACTIVITIES,
} from '../utils/activities';

const EvaluationList = ({
  route,
  navigation,
}: NativeStackScreenProps<ProfileNavigatorParamList>) => {
  const {category} =
    route.params as ProfileNavigatorParamList['EvaluationList'];
  const [filter, setFilter] = useState(FilterType.TODAY);

  const handleOnSelectFilter = (value: string) => {
    setFilter(value as FilterType);
  };

  const handleOnPressItem = (activity: string) => {
    switch (filter) {
      case FilterType.TODAY:
        navigation.push('DailyEvaluation', {activity});
        break;
      default:
        navigation.push('PeriodicEvaluation', {activity, filter});
        break;
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.header}>
        <Select
          variant="unstyled"
          style={styles.filter as StyleProp<ViewStyle>}
          dropdownIcon={<FilterIconImg style={styles.filterIcon} />}
          selectedValue={filter}
          accessibilityLabel="Choose Filter"
          placeholder="Choose Filter"
          onValueChange={handleOnSelectFilter}>
          <Select.Item label="Today" value={FilterType.TODAY} />
          <Select.Item label="This Week" value={FilterType.THIS_WEEK} />
          <Select.Item label="Last Week" value={FilterType.LAST_WEEK} />
          <Select.Item label="Monthly" value={FilterType.MONTHLY} />
        </Select>
      </View>

      <View>
        {category === 'Daily' && (
          <View>
            <ActivityItem
              icon={SolahIconImg}
              activity="Solah"
              style={styles.activityItem}
              onPress={() => handleOnPressItem('Solah')}
            />
            {DAILY_ACTIVITIES.map((activity, index) => (
              <ActivityItem
                key={index}
                icon={activity.icon}
                activity={activity.title}
                style={styles.activityItem}
                onPress={() => handleOnPressItem(activity.title)}
              />
            ))}
          </View>
        )}
        {category === 'Weekly' && (
          <View>
            {WEEKLY_ACTIVITIES.map((activity, index) => (
              <ActivityItem
                key={index}
                icon={activity.icon}
                activity={activity.title}
                style={styles.activityItem}
                onPress={() => handleOnPressItem(activity.title)}
              />
            ))}
          </View>
        )}
        {category === 'Monthly' && (
          <View>
            {MONTHLY_ACTIVITIES.map((activity, index) => (
              <ActivityItem
                key={index}
                icon={activity.icon}
                activity={activity.title}
                style={styles.activityItem}
                onPress={() => handleOnPressItem(activity.title)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 40,
    borderColor: '#BBDACE',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  filter: {
    ...globalStyles.text,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  filterIcon: {
    marginRight: 16,
  },
});

export default EvaluationList;
