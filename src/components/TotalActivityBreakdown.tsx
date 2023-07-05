import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Progress from 'react-native-progress';
import {
  GlobalColors,
  globalFonts,
  globalStyles,
  normalizeFont,
} from '../styles/global';
import {TotalEvaluationGroup} from '../types/global';
import {resolveActivityDetails} from '../utils/activities';

export interface TotalActivityBreakdownProps {
  style?: StyleProp<ViewStyle>;
  progress: number;
  activities: TotalEvaluationGroup[];
  isDarkMode?: boolean;
}

const TotalActivityBreakdown = ({
  style,
  progress,
  activities,
  isDarkMode,
}: TotalActivityBreakdownProps) => {
  const {t} = useTranslation();

  const formatCount = (count: number) => {
    return count < 10 ? `0${count}` : count;
  };

  return (
    <View
      style={[styles.card, style, isDarkMode && globalStyles.darkModeOverlay]}>
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
        textStyle={
          [
            styles.progressText,
            isDarkMode && globalStyles.darkModeText,
          ] as TextStyle
        }
        color={GlobalColors.primary}
        unfilledColor="#DEEDE7"
        borderColor="#DEEDE7"
      />
      <View style={styles.details}>
        {activities.map((activity, index) => (
          <View
            key={`breakdown-activity-${index}`}
            style={[index === activities.length - 1 && styles.breakdownItem]}>
            <View style={styles.activityRow}>
              <Text
                style={[styles.text, isDarkMode && globalStyles.darkModeText]}>
                {resolveActivityDetails(activity.title, t)}
              </Text>
              <View style={[styles.dots, isDarkMode && styles.darkModeDots]} />
              <Text
                style={[
                  styles.text,
                  styles.countText,
                  isDarkMode && globalStyles.darkModeText,
                ]}>
                {formatCount(activity.completedCount)}/{activity.totalCount}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
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
    color: GlobalColors.gray,
    fontSize: normalizeFont(18),
    ...globalFonts.spaceGrotesk.bold,
  },
  details: {
    flexGrow: 1,
  },
  breakdownItem: {
    marginBottom: 10,
  },
  activityRow: {
    flexDirection: 'row',
  },
  text: {
    ...globalStyles.text,
    ...globalFonts.aeonik.regular,
    color: GlobalColors.gray,
    fontSize: normalizeFont(14),
  },
  dots: {
    marginBottom: 4,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderBottomColor: GlobalColors.gray,
    flexGrow: 1,
  },
  darkModeDots: {
    borderBottomColor: GlobalColors.darkModeTextColor,
  },
  countText: {
    ...globalFonts.aeonik.regular,
    fontVariant: ['tabular-nums'],
  },
});

export default TotalActivityBreakdown;
