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
import {globalStyles} from '../styles/global';
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
  onCheckboxChange?: () => void;
  customEndIcon?: ReactElement;
  disableCheckbox?: boolean;
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
}: ActivityItemProps) => {
  return (
    <Pressable
      style={[styles.activityItem, disabled && styles.disabled, style]}
      onPress={() => !disabled && onPress && onPress()}>
      {!hideStartIcon && <Image source={icon || ZhurIconImg} />}
      <Text style={[styles.activity, hideStartIcon && styles.noStartIcon]}>
        {activity}
      </Text>
      {showEndIcon
        ? customEndIcon ||
          (endIcon === 'chevron-up' ? (
            <ChevronUpIconImg />
          ) : endIcon === 'chevron-down' ? (
            <ChevronDownIconImg />
          ) : (
            <Checkbox
              value={checkboxValue || 'checkbox'}
              onChange={onCheckboxChange}
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
  noStartIcon: {
    marginLeft: 8,
  },
  activity: {
    marginLeft: 24,
    ...globalStyles.text,
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
