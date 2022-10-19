import {extendTheme} from 'native-base';

const newColorTheme = {
  primary: {
    '50': '#9DDCC4',
    '100': '#8ED7BB',
    '200': '#70CCA9',
    '300': '#52C197',
    '400': '#3EAD83',
    '500': '#338F6C',
    '600': '#24664D',
    '700': '#163C2E',
    '800': '#07130E',
    '900': '#000000',
  },
};
export const nativeBaseTheme = extendTheme({
  colors: newColorTheme,
});

export const nativeBaseInset = {
  frame: {x: 0, y: 0, width: 0, height: 0},
  insets: {top: 0, left: 0, right: 0, bottom: 0},
};
