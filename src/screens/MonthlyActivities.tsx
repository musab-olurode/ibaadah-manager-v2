import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {globalStyles} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import Accordion from 'react-native-collapsible/Accordion';
import {ActivityCategory, Theme} from '../types/global';
import {MONTHLY_ACTIVITIES, resolveActivityDetails} from '../utils/activities';
import PlusIconImg from '../assets/icons/plus.svg';
import {Fab} from 'native-base';
import {useIsFocused} from '@react-navigation/native';
import {Activity} from '../database/entities/Activity';
import {RawActivity} from '../types/global';
import {ActivityService} from '../services/ActivityService';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {useTranslation} from 'react-i18next';
import usePreferredTheme from '../hooks/usePreferredTheme';

const MonthlyActivities = ({
  navigation,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [monthlyActivities, setMonthlyActivities] = useState<Activity[]>([]);
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const preferredTheme = usePreferredTheme();

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
    navigation.push('ManageActivities', {category: ActivityCategory.Monthly});
  };

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
    await getMonthlyActivities();
  };

  const renderHeader = (
    section: RawActivity,
    index: number,
    isActive: boolean,
  ) => {
    const CUSTOM_GROUP = 'Custom';
    const customActivities = monthlyActivities.filter(
      activity => activity.group === CUSTOM_GROUP,
    );
    if (section.group === CUSTOM_GROUP && customActivities.length === 0) {
      return <></>;
    } else {
      return (
        <ActivityItem
          isDarkMode={preferredTheme === Theme.DARK}
          icon={section.icon}
          activity={resolveActivityDetails(section.group, t)}
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
      <View
        style={[
          styles.content,
          preferredTheme === Theme.DARK && globalStyles.darkModeOverlay,
        ]}>
        {monthlyActivities
          .filter(activity => activity.group === group)
          .map((contentItem, contentIndex) => (
            <ActivityItem
              isDarkMode={preferredTheme === Theme.DARK}
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

  const getMonthlyActivities = async () => {
    const _monthlyActivities = await ActivityService.getOrCreateForThisMonth({
      category: ActivityCategory.Monthly,
    });
    setMonthlyActivities(_monthlyActivities);
  };

  useEffect(() => {
    getMonthlyActivities();
  }, [isFocused]);

  return (
    <ScrollView
      style={[
        globalStyles.container,
        preferredTheme === Theme.DARK && globalStyles.darkModeContainer,
      ]}>
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
