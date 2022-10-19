import React from 'react';
import {StyleSheet, Text, View, StyleProp, ViewStyle} from 'react-native';
import * as Progress from 'react-native-progress';
import {GlobalColors, globalStyles, normalizeFont} from '../styles/global';

export interface TotalActivityBreakdownProps {
  style?: StyleProp<ViewStyle>;
  activities: {name: string; completed: number; total: number}[];
}

const TotalActivityBreakdown = ({
  style,
  activities,
}: TotalActivityBreakdownProps) => {
  return (
    <View style={[styles.card, style]}>
      <Progress.Circle
        size={70}
        progress={0.2}
        showsText
        formatText={() => '5%'}
        style={styles.progress}
        textStyle={styles.progressText}
        color={GlobalColors.primary}
        unfilledColor="#DEEDE7"
        borderColor="#DEEDE7"
      />
      <View style={styles.details}>
        {activities.map((activity, index) => (
          <View key={`breakdown-activity-${index}`}>
            <View style={styles.activityRow}>
              <Text style={styles.text}>{activity.name}</Text>
              <View style={styles.dots} />
              <Text style={styles.text}>
                {activity.completed}/{activity.total}
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
    color: '#505050',
    fontWeight: '500',
    fontSize: normalizeFont(20),
  },
  details: {
    flexGrow: 1,
  },
  activityRow: {
    flexDirection: 'row',
  },
  text: {
    ...globalStyles.text,
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
});

export default TotalActivityBreakdown;
