import React from 'react';
import {useColorMode} from 'native-base';
import {useEffect} from 'react';
import {useColorScheme} from 'react-native';

export const SyncColorMode = () => {
  const colorScheme = useColorScheme();
  const {setColorMode} = useColorMode();

  useEffect(() => {
    if (colorScheme) {
      setColorMode(colorScheme);
    }
  }, [colorScheme, setColorMode]);

  return <></>;
};
