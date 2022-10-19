import React, {useState} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {globalStyles} from '../styles/global';
import SolahIconImg from '../assets/icons/solah.png';
import ActivityItem from '../components/ActivityItem';
import Accordion from 'react-native-collapsible/Accordion';
import {Fab} from 'native-base';
import PlusIconImg from '../assets/icons/plus.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useIsFocused} from '@react-navigation/native';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {DAILY_ACTIVITIES} from '../utils/activities';

const DailyActivities = ({
  navigation,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
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

  const onPressSolah = () => {
    navigation.push('Solah');
  };

  const onPressAddActivity = () => {
    navigation.push('ManageActivities', {category: 'Daily'});
  };

  const renderHeader = (
    section: typeof DAILY_ACTIVITIES[0],
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
    {content}: {content: typeof DAILY_ACTIVITIES[0]['content']},
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
      <ActivityItem
        icon={SolahIconImg}
        activity="Solah"
        style={styles.activityItem}
        onPress={onPressSolah}
      />
      <Accordion
        containerStyle={styles.accordion}
        sections={DAILY_ACTIVITIES}
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
  accordion: {
    marginBottom: 80,
  },
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

export default DailyActivities;
