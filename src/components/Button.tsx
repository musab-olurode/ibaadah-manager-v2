import React, {ReactElement} from 'react';
import {
  Pressable,
  Text,
  PressableProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {GlobalColors} from '../styles/global';

interface ButtonProps extends PressableProps {
  text: string | ReactElement;
  variant: 'solid' | 'outline' | 'link';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button = (props: ButtonProps) => {
  const {text, variant, style, textStyle, ...rest} = props;

  return (
    <Pressable
      {...rest}
      style={[
        styles.btn,
        styles[`${variant}Btn` as keyof typeof styles] as ViewStyle,
        style,
      ]}
      accessibilityRole="button">
      <Text
        style={[
          styles.btnText,
          variant === 'solid' ? styles.solidBtnText : styles.outlineText,
          textStyle,
        ]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: GlobalColors.primary,
  },
  btnText: {
    fontSize: 19,
    fontWeight: '400',
  },
  solidBtn: {
    backgroundColor: GlobalColors.primary,
  },
  linkBtn: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  solidBtnText: {
    color: 'white',
  },
  outlineText: {
    color: GlobalColors.primary,
  },
});

export default Button;
