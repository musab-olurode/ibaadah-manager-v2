import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import RootNavigator from './src/navigators/RootNavigator';
import {reduxStore} from './src/redux/store';
import {GlobalColors} from './src/styles/global';
import {nativeBaseInset, nativeBaseTheme} from './src/styles/nativeBase';
import {Provider as ReduxProvider} from 'react-redux';

const App = () => {
  return (
    <ReduxProvider store={reduxStore}>
      <NavigationContainer>
        <NativeBaseProvider
          initialWindowMetrics={nativeBaseInset}
          theme={nativeBaseTheme}>
          <SafeAreaView style={styles.container}>
            <StatusBar
              backgroundColor={GlobalColors.background}
              barStyle="dark-content"
            />
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
