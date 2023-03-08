import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {globalStyles} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import Accordion from 'react-native-collapsible/Accordion';
import {
  ActivityCategory,
  getActivitiesForCurrentDay,
  updateActivitiesForCurrentDay,
  WEEKLY_ACTIVITIES,
} from '../utils/activities';
import PlusIconImg from '../assets/icons/plus.svg';
import {Fab} from 'native-base';
import {useIsFocused} from '@react-navigation/native';
import {Activity} from '../types/global';

const WeeklyActivities = () => {
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [weeklyActivities, setWeeklyActivities] = useState<Activity[]>([]);

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

  const onPressAddActivity = () => {};

  const handleOnCheckboxChange = async (
    isSelected: boolean,
    title: string,
    activity: string,
  ) => {
    const _weeklyActivities = [...weeklyActivities];
    const changedActivityIndex = _weeklyActivities.findIndex(
      solahActivity =>
        solahActivity.activity === activity && solahActivity.title === title,
    );
    _weeklyActivities[changedActivityIndex] = {
      ..._weeklyActivities[changedActivityIndex],
      completed: isSelected,
    };
    setWeeklyActivities(_weeklyActivities);
    await updateActivitiesForCurrentDay(
      _weeklyActivities,
      ActivityCategory.Weekly,
    );
  };

  const renderHeader = (
    section: typeof WEEKLY_ACTIVITIES[0],
    index: number,
    isActive: boolean,
  ) => {
    return (
      <ActivityItem
        icon={section.icon}
        activity={section.title}
        style={[styles.accordionHeader, !isActive && styles.activityItem]}
        showEndIcon={true}
        endIcon={isActive ? 'chevron-up' : 'chevron-down'}
        onPress={() => onPressAccordionHeader(index)}
      />
    );
  };

  const renderContent = ({title}: {title: string}, _index: number) => {
    return (
      <View style={styles.content}>
        {weeklyActivities
          .filter(activity => activity.title === title)
          .map((contentItem, contentIndex) => (
            <ActivityItem
              key={contentIndex}
              icon={contentItem.icon}
              activity={contentItem.activity}
              style={styles.contentItemActivity}
              showEndIcon={true}
              endIcon={'checkbox'}
              bindItemToCheckbox
              defaultCheckboxState={contentItem.completed}
              checkboxValue={`${contentItem.title}-${contentItem.activity}`}
              onCheckboxChange={isSelected =>
                handleOnCheckboxChange(isSelected, title, contentItem.activity)
              }
            />
          ))}
      </View>
    );
  };

  useEffect(() => {
    const getWeeklyActivities = async () => {
      const allActivities = await getActivitiesForCurrentDay();
      const _weeklyActivities = allActivities.data.filter(
        activity => activity.category === ActivityCategory.Weekly,
      );
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
