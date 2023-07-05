import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import RootNavigator from './src/navigators/RootNavigator';
import {reduxStore} from './src/redux/store';
import {
  nativeBaseColorModeManager,
  nativeBaseInset,
  nativeBaseTheme,
} from './src/styles/nativeBase';
import {Provider as ReduxProvider} from 'react-redux';
import './src/utils/IMLocalize';
import {SyncColorMode} from './src/components/UseColorMode';

const App = () => {
  return (
    <ReduxProvider store={reduxStore}>
      <NavigationContainer>
        <NativeBaseProvider
          initialWindowMetrics={nativeBaseInset}
          colorModeManager={nativeBaseColorModeManager}
          theme={nativeBaseTheme}>
          <SyncColorMode />
          <SafeAreaView style={styles.container}>
            <RootNavigator />
          </SafeAreaView>
        </NativeBaseProvider>
      </NavigationContainer>
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
