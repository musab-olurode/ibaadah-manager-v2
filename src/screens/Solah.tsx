import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {globalStyles} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import Accordion from 'react-native-collapsible/Accordion';
import {ActivityCategory} from '../types/global';
import {SOLAH} from '../utils/activities';
import {useIsFocused} from '@react-navigation/native';
import {ActivityService} from '../services/ActivityService';
import {Activity} from '../database/entities/Activity';
import {RawActivity} from '../types/global';

const Solah = () => {
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [solahActivities, setSolahActivities] = useState<Activity[]>([]);

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

  const handleOnCheckboxChange = async (isSelected: boolean, id: string) => {
    const _solahActivities = [...solahActivities];
    const changedActivityIndex = _solahActivities.findIndex(
      solahActivity => solahActivity.id === id,
    );
    _solahActivities[changedActivityIndex] = {
      ..._solahActivities[changedActivityIndex],
      completed: isSelected,
    };
    setSolahActivities(_solahActivities);
    await ActivityService.update(id, _solahActivities[changedActivityIndex]);
    await getSolahActivities();
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
        {solahActivities
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

  const getSolahActivities = async () => {
    const _solahActivities = await ActivityService.getOrCreateForToday({
      category: ActivityCategory.Solah,
    });
    setSolahActivities(_solahActivities);
  };

  useEffect(() => {
    getSolahActivities();
  }, [isFocused]);

  return (
    <ScrollView style={globalStyles.container}>
      <Accordion
        containerStyle={styles.accordion}
        sections={SOLAH}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={updateSections}
      />
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
    backgroundColor: 'white',
  },
  contentItemActivity: {
    elevation: 0,
  },
});

export default Solah;
