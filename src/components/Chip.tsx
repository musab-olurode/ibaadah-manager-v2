import React from 'react';
import {StyleSheet, Text, Pressable, StyleProp, ViewStyle} from 'react-native';
import {
  GlobalColors,
  globalFonts,
  globalStyles,
  normalizeFont,
} from '../styles/global';

export interface ChipProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
  onPress?: () => void;
  isDarkMode?: boolean;
}

const Chip = ({title, active, style, onPress, isDarkMode}: ChipProps) => {
  return (
    <Pressable
      style={[
        styles.chip,
        active && styles.activeChip,
        style,
        isDarkMode && !active ? globalStyles.darkModeOverlay : {},
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          active && styles.activeText,
          isDarkMode && !active ? globalStyles.darkModeText : {},
        ]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
    width: 'auto',
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
  text: {
    fontSize: normalizeFont(16),
    color: GlobalColors.gray,
    ...globalFonts.aeonik.bold,
  },
  activeChip: {
    backgroundColor: GlobalColors.primary,
    borderColor: GlobalColors.primary,
  },
  activeText: {
    color: 'white',
  },
});

export default Chip;
