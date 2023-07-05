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
  darkModeBackground: '#0E0E0E',
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
  darkModeTextColor: '#FFFFFF',
  gray: '#505050',
  'gray.2': '#808080',
  darkModeGray: 'rgba(255, 255, 255, 0.5)',
  darkModeOverlay: '#1C1C1C',
  darkModeInputBackground: '#1E1E1E',
  darkModeInputBorder: 'rgba(255, 255, 255, 0.5)',
  backPressColor: 'rgba(0, 0, 0, .32)',
  darkModeBackPressColor: 'rgba(255, 255, 255, .32)',
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
  darkModeContainer: {
    backgroundColor: GlobalColors.darkModeBackground,
  },
  darkModeOverlay: {
    backgroundColor: GlobalColors.darkModeOverlay,
  },
  darkModeInputBackground: {
    backgroundColor: GlobalColors.darkModeInputBackground,
  },
  text: {
    color: GlobalColors.textColor,
    fontWeight: '400',
    fontSize: GlobalFontSizes.md,
  },
  darkModeText: {
    color: GlobalColors.darkModeTextColor,
  },
  darkModeGrayView: {
    backgroundColor: GlobalColors.darkModeGray,
  },
});

export const globalFonts = {
  aeonik: {
    regular: {
      fontFamily: 'Aeonik-Regular',
    },
    medium: {
      fontFamily: 'Aeonik-Medium',
    },
    light: {
      fontFamily: 'Aeonik-Light',
    },
    bold: {
      fontFamily: 'Aeonik-Bold',
    },
  },
  spaceGrotesk: {
    regular: {
      fontFamily: 'SpaceGrotesk-Regular',
    },
    medium: {
      fontFamily: 'SpaceGrotesk-Medium',
    },
    light: {
      fontFamily: 'SpaceGrotesk-Light',
    },
    bold: {
      fontFamily: 'SpaceGrotesk-Bold',
    },
  },
};

// const isDarkMode = useColorScheme() === 'dark';

// const backgroundStyle = {
//   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
// };
