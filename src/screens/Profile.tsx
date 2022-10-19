import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Pressable,
} from 'react-native';
import {GlobalColors, globalStyles, normalizeFont} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import DailyActivitiesIconImg from '../assets/icons/daily-activities.png';
import WeeklyActivitiesIconImg from '../assets/icons/weekly-activities.png';
import MonthlyActivitiesIconImg from '../assets/icons/monthly-activities.png';
import AvatarImg from '../assets/avatar.png';
import EditIconImg from '../assets/icons/edit.svg';
import GlossaryIconImg from '../assets/icons/glossary.png';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileNavigatorParamList} from '../navigators/ProfileNavigator';

const Profile = ({
  navigation,
}: NativeStackScreenProps<ProfileNavigatorParamList>) => {
  const ACTIONS = [
    {
      icon: DailyActivitiesIconImg,
      name: 'Daily Activities Evaluation',
      onPress: () => handleOnPressCreateActivity('EvaluationList', 'Daily'),
    },
    {
      icon: WeeklyActivitiesIconImg,
      name: 'Weekly Activities Evaluation',
      onPress: () => handleOnPressCreateActivity('EvaluationList', 'Weekly'),
    },
    {
      icon: MonthlyActivitiesIconImg,
      name: 'Monthly Activities Evaluation',
      onPress: () => handleOnPressCreateActivity('EvaluationList', 'Monthly'),
    },
  ];

  function handleOnPressCreateActivity(
    screen: keyof ProfileNavigatorParamList,
    category: ProfileNavigatorParamList['EvaluationList']['category'],
  ) {
    navigation.push(screen, {category});
  }

  const handleOnPressGotoGlossary = () => {
    navigation.push('Glossary');
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={AvatarImg} style={styles.avatar} />
          <Pressable style={styles.editProfileBtn}>
            <EditIconImg />
          </Pressable>
        </View>

        <Text style={styles.name}>Qoreebullah</Text>
      </View>

      <Text style={styles.sectionTitle}>Self Evaluation</Text>

      <View>
        {ACTIONS.map((action, index) => (
          <ActivityItem
            key={index}
            icon={action.icon}
            activity={action.name}
            style={styles.activityItem}
            onPress={action.onPress}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Glossary</Text>

      <ActivityItem
        icon={GlossaryIconImg}
        activity={'Meaning of some words'}
        style={[styles.activityItem, styles.glossaryItem]}
        onPress={handleOnPressGotoGlossary}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: GlobalColors.primary,
    width: 'auto',
    position: 'relative',
  },
  avatar: {
    borderRadius: 100,
    margin: 8.16,
  },
  name: {
    ...globalStyles.text,
    fontWeight: '500',
    fontSize: normalizeFont(24),
    marginTop: 16,
    marginBottom: 51,
  },
  editProfileBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 9,
    borderRadius: 100,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 24,
  },
  sectionTitle: {
    ...globalStyles.text,
    fontWeight: '500',
    fontSize: normalizeFont(20),
    marginBottom: 16,
  },
  glossaryItem: {
    marginBottom: 48,
  },
});

export default Profile;
