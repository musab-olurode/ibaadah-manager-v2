import {StyleSheet, Dimensions, Platform, PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 380;

export const normalizeFont = (size: number) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const GlobalColors = {
  background: '#F3F4F6',
  primary: '#338F6C',
  'primary.50': '#9DDCC4',
  'primary.100': '#8ED7BB',
  'primary.200': '#70CCA9',
  'primary.300': '#52C197',
  'primary.400': '#3EAD83',
  'primary.500': '#338F6C',
  'primary.600': '#24664D',
  'primary.700': '#163C2E',
  'primary.800': '#07130E',
  'primary.900': '#000000',
  textColor: '#151515',
  gray: '#505050',
  'gray.2': '#808080',
};

export const GlobalFontSizes = {
  xs: normalizeFont(13),
  sm: normalizeFont(16),
  md: normalizeFont(18),
  lg: normalizeFont(21),
  xl: normalizeFont(25),
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: GlobalColors.background,
  },
  text: {
    color: GlobalColors.textColor,
    fontWeight: '400',
    fontSize: GlobalFontSizes.md,
  },
});

// const isDarkMode = useColorScheme() === 'dark';

// const backgroundStyle = {
//   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
// };
