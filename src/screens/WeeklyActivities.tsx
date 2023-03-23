import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {globalStyles} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import Accordion from 'react-native-collapsible/Accordion';
import {ActivityCategory} from '../types/global';
import {resolveActivityDetails, WEEKLY_ACTIVITIES} from '../utils/activities';
import PlusIconImg from '../assets/icons/plus.svg';
import {Fab} from 'native-base';
import {useIsFocused} from '@react-navigation/native';
import {Activity} from '../database/entities/Activity';
import {ActivityService} from '../services/ActivityService';
import {RawActivity} from '../types/global';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {useTranslation} from 'react-i18next';

const WeeklyActivities = ({
  navigation,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [weeklyActivities, setWeeklyActivities] = useState<Activity[]>([]);
  const {t} = useTranslation();
  const isFocused = useIsFocused();

  const updateSections = (sections: number[]) => {
    setActiveSections(sections);
  };

  const onPressAccordionHeader = (index: number) => {
    if (activeSections.includes(index)) {
      const activeSectionsIndex = activeSections.indexOf(index);
      const _activeSections = [...activeSections];
      _activeSections.splice(activeSectionsIndex, 1);
      updateSections(_activeSections);
    } else {
      updateSections([index]);
    }
  };

  const onPressAddActivity = () => {
    navigation.push('ManageActivities', {category: ActivityCategory.Weekly});
  };

  const handleOnCheckboxChange = async (isSelected: boolean, id: string) => {
    const _weeklyActivities = [...weeklyActivities];
    const changedActivityIndex = _weeklyActivities.findIndex(
      solahActivity => solahActivity.id === id,
    );
    _weeklyActivities[changedActivityIndex] = {
      ..._weeklyActivities[changedActivityIndex],
      completed: isSelected,
    };
    setWeeklyActivities(_weeklyActivities);
    await ActivityService.update(id, _weeklyActivities[changedActivityIndex]);
  };

  const renderHeader = (
    section: RawActivity,
    index: number,
    isActive: boolean,
  ) => {
    const CUSTOM_GROUP = 'Custom';
    const customActivities = weeklyActivities.filter(
      activity => activity.group === CUSTOM_GROUP,
    );
    if (section.group === CUSTOM_GROUP && customActivities.length === 0) {
      return <></>;
    } else {
      return (
        <ActivityItem
          icon={section.icon}
          activity={section.group}
          style={[styles.accordionHeader, !isActive && styles.activityItem]}
          showEndIcon={true}
          endIcon={isActive ? 'chevron-up' : 'chevron-down'}
          onPress={() => onPressAccordionHeader(index)}
        />
      );
    }
  };

  const renderContent = ({group}: {group: string}, _index: number) => {
    return (
      <View style={styles.content}>
        {weeklyActivities
          .filter(activity => activity.group === group)
          .map((contentItem, contentIndex) => (
            <ActivityItem
              key={contentIndex}
              icon={contentItem.icon}
              activity={resolveActivityDetails(contentItem.title, t)}
              style={styles.contentItemActivity}
              showEndIcon={true}
              endIcon={'checkbox'}
              bindItemToCheckbox
              defaultCheckboxState={contentItem.completed}
              checkboxValue={`${contentItem.group}-${contentItem.title}`}
              onCheckboxChange={isSelected =>
                handleOnCheckboxChange(isSelected, contentItem.id)
              }
            />
          ))}
      </View>
    );
  };

  useEffect(() => {
    const getWeeklyActivities = async () => {
      const _weeklyActivities = await ActivityService.getOrCreateForThisWeek({
        category: ActivityCategory.Weekly,
      });
      setWeeklyActivities(_weeklyActivities);
    };
    getWeeklyActivities();
  }, [isFocused]);

  return (
    <ScrollView style={globalStyles.container}>
      <Accordion
        containerStyle={styles.accordion}
        sections={WEEKLY_ACTIVITIES}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={updateSections}
      />
      {isFocused && <Fab icon={<PlusIconImg />} onPress={onPressAddActivity} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    marginBottom: 24,
  },
  accordion: {},
  accordionHeader: {
    marginBottom: 8,
  },
  content: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(187, 218, 206, 0.7)',
    marginBottom: 24,
  },
  contentItemActivity: {
    elevation: 0,
  },
});

export default WeeklyActivities;
