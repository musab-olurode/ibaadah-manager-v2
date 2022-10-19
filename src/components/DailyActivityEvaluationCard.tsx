import {Checkbox} from 'native-base';
import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import * as Progress from 'react-native-progress';
import {GlobalColors, globalStyles, normalizeFont} from '../styles/global';

export interface DailyActivityEvaluationCardProps {
  activity: string;
  style?: StyleProp<ViewStyle>;
  actions: {name: string; completed: boolean}[];
}

const DailyActivityEvaluationCard = ({
  activity,
  actions,
  style,
}: DailyActivityEvaluationCardProps) => {
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
        <Text style={[globalStyles.text, styles.activity]}>{activity}</Text>
        <View style={styles.actions}>
          {actions.map((action, index) => (
            <View key={`action-${index}`} style={styles.actionRow}>
              <Text style={styles.actionTitle}>{action.name}</Text>
              <Checkbox
                value={action.name}
                accessibilityLabel={`${action.name} check`}
                size="sm"
                isDisabled
                defaultIsChecked={action.completed}
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
    fontWeight: '500',
    fontSize: normalizeFont(20),
  },
  details: {
    flexGrow: 1,
  },
  activity: {
    fontWeight: '600',
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
    fontWeight: '400',
    fontSize: normalizeFont(14),
    color: GlobalColors['gray.2'],
  },
});

export default DailyActivityEvaluationCard;
