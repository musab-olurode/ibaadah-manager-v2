import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {globalStyles} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import {Activity} from '../database/entities/Activity';
import {useIsFocused} from '@react-navigation/native';
import {ActivityService} from '../services/ActivityService';
import {ActivityType} from '../types/global';
import {FlatList, Checkbox} from 'native-base';
import Button from '../components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigators/RootNavigator';

const RemoveCustomActivities = ({
  route,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {category} =
    route.params as RootNavigatorParamList['RemoveCustomActivities'];
  const [customActivities, setCustomActivities] = useState<Activity[]>([]);
  const [customActivitiesToRemove, setCustomActivitiesToRemove] = useState<
    Activity[]
  >([]);
  const [selectAll, setSelectAll] = useState(false);

  const isFocused = useIsFocused();

  const handleOnPressItem = (activity: Activity) => {
    const isActivitySelected = customActivitiesToRemove.find(
      item => item.id === activity.id,
    );
    if (isActivitySelected) {
      setSelectAll(false);
      const activitiesWithoutSelected = customActivitiesToRemove.filter(
        item => item.id !== activity.id,
      );
      setCustomActivitiesToRemove(activitiesWithoutSelected);
    } else {
      setCustomActivitiesToRemove([...customActivitiesToRemove, activity]);
    }
  };

  const getCheckboxValue = (activity: Activity) => {
    const isActivitySelected = customActivitiesToRemove.find(
      item => item.id === activity.id,
    );
    return !!isActivitySelected;
  };

  const handleOnChangeSelectAll = (isSelected: boolean) => {
    setSelectAll(isSelected);
    if (isSelected) {
      setCustomActivitiesToRemove(customActivities);
    } else {
      setCustomActivitiesToRemove([]);
    }
  };

  const handleOnPressRemoveActivities = async () => {
    const customActivitiesToRemoveIds = customActivitiesToRemove.map(
      activity => activity.id,
    );
    await ActivityService.removeActivities(customActivitiesToRemoveIds);
    setCustomActivitiesToRemove([]);
    setSelectAll(false);
    getCustomActivities();
  };

  const renderItem = ({item}: {item: Activity}) => (
    <ActivityItem
      icon={item.icon}
      activity={item.title}
      style={styles.activityItem}
      showEndIcon
      bindItemToCheckbox
      defaultCheckboxState={getCheckboxValue(item)}
      onCheckboxChange={() => handleOnPressItem(item)}
    />
  );

  const getCustomActivities = async () => {
    const activities = await ActivityService.find({
      type: ActivityType.CUSTOM,
      category,
    });
    setCustomActivities(activities);
  };

  useEffect(() => {
    getCustomActivities();
  }, [isFocused]);

  return (
    <>
      <View style={styles.selectAllContainer}>
        <Text style={[globalStyles.text, styles.selectAllText]}>
          Select All
        </Text>
        <Checkbox
          value="select-all"
          accessibilityLabel="Select all"
          isChecked={selectAll}
          onChange={handleOnChangeSelectAll}
        />
      </View>
      <FlatList
        style={globalStyles.container}
        data={customActivities}
        renderItem={renderItem}
      />
      <View style={styles.removeBtnContainer}>
        <Button
          disabled={customActivitiesToRemove.length === 0}
          style={[
            styles.removeBtn,
            customActivitiesToRemove.length === 0 && styles.disabledBtn,
          ]}
          variant="solid"
          text="Remove Selected"
          onPress={handleOnPressRemoveActivities}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    marginBottom: 24,
  },
  selectAllContainer: {
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  selectAllText: {
    marginRight: 8,
  },
  removeBtnContainer: {
    marginVertical: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  removeBtn: {
    backgroundColor: 'red',
    borderColor: 'red',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});

export default RemoveCustomActivities;
