import {StyleSheet, View, Animated, useWindowDimensions} from 'react-native';
import React from 'react';
import {GlobalColors} from '../../styles/global';

const PageIndicator = ({
  data,
  scrollX,
  isDarkMode,
}: {
  data: any[];
  scrollX: Animated.AnimatedInterpolation<string | number>;
  isDarkMode: boolean;
}) => {
  const {width} = useWindowDimensions();

  return (
    <View style={styles.pageIndicatorContainer}>
      {data.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 35, 8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: isDarkMode ? [1, 1, 1] : [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: [
            GlobalColors.darkModeGray,
            GlobalColors.primary,
            GlobalColors.darkModeGray,
          ],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[
              styles.dot,
              {width: dotWidth, opacity},
              isDarkMode && {backgroundColor},
            ]}
            key={`dot-${index}`}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  pageIndicatorContainer: {
    flexDirection: 'row',
  },
  dot: {
    height: 8,
    borderRadius: 5,
    backgroundColor: GlobalColors.primary,
    marginHorizontal: 8,
  },
});

export default PageIndicator;
