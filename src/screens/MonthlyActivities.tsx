import React, {useState} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {globalStyles} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import Accordion from 'react-native-collapsible/Accordion';
import {MONTHLY_ACTIVITIES} from '../utils/activities';
import PlusIconImg from '../assets/icons/plus.svg';
import {Fab} from 'native-base';
import {useIsFocused} from '@react-navigation/native';

const MonthlyActivities = () => {
  const [activeSections, setActiveSections] = useState<number[]>([]);

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

  const renderHeader = (
    section: typeof MONTHLY_ACTIVITIES[0],
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

  const renderContent = (
    {content}: {content: typeof MONTHLY_ACTIVITIES[0]['content']},
    _index: number,
  ) => {
    return (
      <View style={styles.content}>
        {content.map((contentItem, contentIndex) => (
          <ActivityItem
            key={contentIndex}
            icon={contentItem.icon}
            activity={contentItem.activity}
            style={styles.contentItemActivity}
            showEndIcon={true}
            endIcon={'checkbox'}
          />
        ))}
      </View>
    );
  };

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
