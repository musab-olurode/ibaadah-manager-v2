import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {globalStyles} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import Accordion from 'react-native-collapsible/Accordion';
import {ActivityCategory, MONTHLY_ACTIVITIES} from '../utils/activities';
import PlusIconImg from '../assets/icons/plus.svg';
import {Fab} from 'native-base';
import {useIsFocused} from '@react-navigation/native';
import {Activity} from '../database/entities/Activity';
import {RawActivity} from '../types/global';
import {ActivityService} from '../services/ActivityService';

const MonthlyActivities = () => {
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [monthlyActivities, setMonthlyActivities] = useState<Activity[]>([]);

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

  const handleOnCheckboxChange = async (isSelected: boolean, id: string) => {
    const _monthlyActivities = [...monthlyActivities];
    const changedActivityIndex = _monthlyActivities.findIndex(
      solahActivity => solahActivity.id === id,
    );
    _monthlyActivities[changedActivityIndex] = {
      ..._monthlyActivities[changedActivityIndex],
      completed: isSelected,
    };
    setMonthlyActivities(_monthlyActivities);
    await ActivityService.update(id, _monthlyActivities[changedActivityIndex]);
  };

  const renderHeader = (
    section: RawActivity,
    index: number,
    isActive: boolean,
  ) => {
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
  };

  const renderContent = ({group}: {group: string}, _index: number) => {
    return (
      <View style={styles.content}>
        {monthlyActivities
          .filter(activity => activity.group === group)
          .map((contentItem, contentIndex) => (
            <ActivityItem
              key={contentIndex}
              icon={contentItem.icon}
              activity={contentItem.title}
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
    const getDailyActivities = async () => {
      const _monthlyActivities = await ActivityService.getOrCreateForToday({
        category: ActivityCategory.Monthly,
      });
      setMonthlyActivities(_monthlyActivities);
    };
    getDailyActivities();
  }, [isFocused]);

  return (
    <ScrollView style={globalStyles.container}>
      <Accordion
        containerStyle={styles.accordion}
        sections={MONTHLY_ACTIVITIES}
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

export default MonthlyActivities;
