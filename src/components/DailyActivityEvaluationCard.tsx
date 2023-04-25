import {Checkbox} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import * as Progress from 'react-native-progress';
import {
  GlobalColors,
  globalFonts,
  globalStyles,
  normalizeFont,
} from '../styles/global';
import {resolveActivityDetails} from '../utils/activities';

export interface DailyActivityEvaluationCardProps {
  group: string;
  progress: number;
  style?: StyleProp<ViewStyle>;
  activities: {title: string; completed: boolean}[];
}

const DailyActivityEvaluationCard = ({
  group,
  progress,
  activities,
  style,
}: DailyActivityEvaluationCardProps) => {
  const {t} = useTranslation();

  return (
    <View style={[styles.card, style]}>
      <Progress.Circle
        size={70}
        progress={progress}
        showsText
        formatText={() => {
          const percentage = (progress / 1) * 100;
          return percentage % 1 === 0
            ? `${percentage}%`
            : `${percentage.toFixed(2)}%`;
        }}
        style={styles.progress}
        textStyle={styles.progressText}
        color={GlobalColors.primary}
        unfilledColor="#DEEDE7"
        borderColor="#DEEDE7"
      />
      <View style={styles.details}>
        <Text style={[globalStyles.text, styles.group]}>{group}</Text>
        <View style={styles.actions}>
          {activities.map((activity, index) => (
            <View key={`action-${index}`} style={styles.actionRow}>
              <Text style={styles.actionTitle}>
                {resolveActivityDetails(activity.title, t)}
              </Text>
              <Checkbox
                value={resolveActivityDetails(activity.title, t)}
                accessibilityLabel={`${activity.title} check`}
                size="sm"
                isDisabled
                defaultIsChecked={activity.completed}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: 'rgba(0, 0, 0, 0.03)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 40,
    elevation: 40,
  },
  progress: {
    marginRight: 24,
  },
  progressText: {
    color: '#505050',
    fontSize: normalizeFont(18),
    ...globalFonts.spaceGrotesk.bold,
  },
  details: {
    flexGrow: 1,
  },
  group: {
    ...globalFonts.spaceGrotesk.bold,
  },
  actions: {
    marginTop: 18,
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  actionTitle: {
    flexGrow: 1,
    fontSize: normalizeFont(14),
    color: GlobalColors['gray.2'],
    ...globalFonts.aeonik.regular,
  },
});

export default DailyActivityEvaluationCard;
