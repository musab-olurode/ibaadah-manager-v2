import React, {ReactElement} from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {GlobalColors, globalFonts, globalStyles} from '../styles/global';
import ChevronUpIconImg from '../assets/icons/chevron-up.svg';
import ChevronDownIconImg from '../assets/icons/chevron-down.svg';
import {Checkbox} from 'native-base';
import ZhurIconImg from '../assets/icons/dhur.png';

export interface ActivityItemProps {
  icon?: ImageSourcePropType;
  activity: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
  hideStartIcon?: boolean;
  showEndIcon?: boolean;
  endIcon?: 'chevron-up' | 'chevron-down' | 'checkbox';
  checkboxValue?: string;
  onCheckboxChange?: (isSelected: boolean) => void;
  customEndIcon?: ReactElement;
  disableCheckbox?: boolean;
  defaultCheckboxState?: boolean;
  bindItemToCheckbox?: boolean;
  isDarkMode?: boolean;
}

const ActivityItem = ({
  icon,
  activity,
  disabled,
  onPress,
  style,
  hideStartIcon,
  showEndIcon,
  endIcon,
  checkboxValue,
  onCheckboxChange,
  customEndIcon,
  disableCheckbox,
  defaultCheckboxState,
  bindItemToCheckbox,
  isDarkMode,
}: ActivityItemProps) => {
  const handleOnPressItem = () => {
    if (!disabled && onPress) {
      onPress();
    }
    if (bindItemToCheckbox && onCheckboxChange) {
      onCheckboxChange(!defaultCheckboxState);
    }
  };

  return (
    <Pressable
      style={[
        styles.activityItem,
        disabled && styles.disabled,
        isDarkMode && globalStyles.darkModeOverlay,
        style,
      ]}
      onPress={handleOnPressItem}>
      {!hideStartIcon && (
        <Image style={styles.startIcon} source={icon || ZhurIconImg} />
      )}
      <Text
        style={[
          styles.activity,
          isDarkMode && globalStyles.darkModeText,
          hideStartIcon && styles.noStartIcon,
        ]}>
        {activity}
      </Text>
      {showEndIcon
        ? customEndIcon ||
          (endIcon === 'chevron-up' ? (
            <ChevronUpIconImg
              style={[
                styles.chevronIcon as ViewStyle,
                isDarkMode && (globalStyles.darkModeText as ViewStyle),
              ]}
            />
          ) : endIcon === 'chevron-down' ? (
            <ChevronDownIconImg
              style={[
                styles.chevronIcon as ViewStyle,
                isDarkMode && (globalStyles.darkModeText as ViewStyle),
              ]}
            />
          ) : (
            <Checkbox
              value={checkboxValue || 'checkbox'}
              onChange={onCheckboxChange}
              isChecked={defaultCheckboxState}
              accessibilityLabel={activity}
              isDisabled={disableCheckbox}
            />
          ))
        : undefined}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  startIcon: {
    width: 48,
    height: 48,
  },
  chevronIcon: {
    color: GlobalColors.gray,
  },
  noStartIcon: {
    marginLeft: 8,
  },
  activity: {
    marginLeft: 24,
    ...globalStyles.text,
    ...globalFonts.aeonik.regular,
    shadowColor: 'rgba(0, 0, 0, 0.03)',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    flexGrow: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ActivityItem;
