import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {GlobalColors, globalStyles} from '../styles/global';

interface InputProps extends TextInputProps {
  innerRef?: React.ClassAttributes<TextInput>['ref'];
  style?: StyleProp<ViewStyle>;
}

const Input = (props: InputProps) => {
  const {style, innerRef, ...rest} = props;

  return (
    <TextInput
      ref={innerRef}
      placeholderTextColor={GlobalColors['gray.2']}
      {...rest}
      style={[styles.input, style]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
    width: '100%',
    color: globalStyles.text.color,
  },
});

export default Input;
