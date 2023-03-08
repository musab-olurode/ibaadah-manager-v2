import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {globalStyles} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import Accordion from 'react-native-collapsible/Accordion';
import {
  ActivityCategory,
  getActivitiesForCurrentDay,
  SOLAH,
  updateActivitiesForCurrentDay,
} from '../utils/activities';
import {Activity} from '../types/global';
import {useIsFocused} from '@react-navigation/native';

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

  const handleOnCheckboxChange = async (
    isSelected: boolean,
    title: string,
    activity: string,
  ) => {
    const _solahActivities = [...solahActivities];
    const changedActivityIndex = _solahActivities.findIndex(
      solahActivity =>
        solahActivity.activity === activity && solahActivity.title === title,
    );
    _solahActivities[changedActivityIndex] = {
      ..._solahActivities[changedActivityIndex],
      completed: isSelected,
    };
    setSolahActivities(_solahActivities);
    await updateActivitiesForCurrentDay(
      _solahActivities,
      ActivityCategory.Solah,
    );
  };

  const renderHeader = (
    section: typeof SOLAH[0],
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
        {solahActivities
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
    const getSolahActivities = async () => {
      const allActivities = await getActivitiesForCurrentDay();
      const _solahActivities = allActivities.data.filter(
        activity => activity.category === ActivityCategory.Solah,
      );
      setSolahActivities(_solahActivities);
    };
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
