import React, {useState, useEffect} from 'react';
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
import {ActivityCategory, Theme} from '../types/global';
import {DAILY_ACTIVITIES, resolveActivityDetails} from '../utils/activities';
import {Activity} from '../database/entities/Activity';
import {ActivityService} from '../services/ActivityService';
import {RawActivity} from '../types/global';
import {useTranslation} from 'react-i18next';
import usePreferredTheme from '../hooks/usePreferredTheme';

const DailyActivities = ({
  navigation,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [dailyActivities, setDailyActivities] = useState<Activity[]>([]);
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

  const onPressSolah = () => {
    navigation.push('Solah');
  };

  const onPressAddActivity = () => {
    navigation.push('ManageActivities', {category: ActivityCategory.Daily});
  };

  const handleOnCheckboxChange = async (isSelected: boolean, id: string) => {
    const _dailyActivities = [...dailyActivities];
    const changedActivityIndex = _dailyActivities.findIndex(
      solahActivity => solahActivity.id === id,
    );
    _dailyActivities[changedActivityIndex] = {
      ..._dailyActivities[changedActivityIndex],
      completed: isSelected,
    };
    setDailyActivities(_dailyActivities);
    await ActivityService.update(id, _dailyActivities[changedActivityIndex]);
    await getDailyActivities();
  };

  const renderHeader = (
    section: RawActivity,
    index: number,
    isActive: boolean,
  ) => {
    const CUSTOM_GROUP = 'Custom';
    const customActivities = dailyActivities.filter(
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
        {dailyActivities
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

  const getDailyActivities = async () => {
    const _dailyActivities = await ActivityService.getOrCreateForToday({
      category: ActivityCategory.Daily,
    });
    setDailyActivities(_dailyActivities);
  };

  useEffect(() => {
    getDailyActivities();
  }, [isFocused]);

  return (
    <ScrollView
      style={[
        globalStyles.container,
        preferredTheme === Theme.DARK && globalStyles.darkModeContainer,
      ]}>
      <ActivityItem
        isDarkMode={preferredTheme === Theme.DARK}
        icon={SolahIconImg}
        activity={t('common:solah')}
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
