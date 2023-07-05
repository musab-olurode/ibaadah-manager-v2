import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, ScrollView, useColorScheme} from 'react-native';
import ActivityItem from '../components/ActivityItem';
import {GlobalColors, globalStyles, normalizeFont} from '../styles/global';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ThemeIconImg from '../assets/icons/theme.png';
import AboutIconImg from '../assets/icons/about.png';
import {Modal, Radio, useColorMode, useColorModeValue} from 'native-base';
import {ProfileNavigatorParamList} from '../navigators/ProfileNavigator';
import usePreferredTheme from '../hooks/usePreferredTheme';
import {Theme} from '../types/global';
import {getTheme, setTheme} from '../utils/storage';
import {useDispatch} from 'react-redux';
import {setAppTheme} from '../redux/theme/themeSlice';
import {useIsFocused} from '@react-navigation/native';

const Settings = ({
  navigation,
}: NativeStackScreenProps<ProfileNavigatorParamList>) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    Theme.FOLLOW_SYSTEM,
  );
  const [showThemeModal, setShowThemeModal] = useState(false);
  const preferredTheme = usePreferredTheme();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {toggleColorMode} = useColorMode();
  const deviceTheme = useColorScheme();
  const nativeBaseTheme = useColorModeValue(Theme.LIGHT, Theme.DARK);

  const handleOnPressTheme = () => {
    setShowThemeModal(true);
  };

  const handleOnPressAbout = () => {
    navigation.push('About');
  };

  const formatThemeLabel = (theme: Theme) => {
    return theme
      .replace(/_/g, ' ')
      .replace(
        /\w\S*/g,
        txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
      );
  };

  const handleOnChangeTheme = async (theme: Theme) => {
    setShowThemeModal(false);
    if (theme === Theme.FOLLOW_SYSTEM) {
      if (deviceTheme !== nativeBaseTheme) {
        toggleColorMode();
      }
    } else if (theme !== nativeBaseTheme) {
      toggleColorMode();
    }
    setSelectedTheme(theme);
    await setTheme(theme);
    dispatch(setAppTheme(theme));
  };

  useEffect(() => {
    const fetchTheme = async () => {
      await getTheme().then(theme => {
        theme && setSelectedTheme(theme);
      });
    };
    fetchTheme();
  }, [isFocused, preferredTheme]);

  return (
    <>
      <ScrollView
        style={[
          globalStyles.container,
          preferredTheme === Theme.DARK && globalStyles.darkModeContainer,
        ]}>
        <ActivityItem
          isDarkMode={preferredTheme === Theme.DARK}
          onPress={handleOnPressTheme}
          style={styles.activityItem}
          showEndIcon
          customEndIcon={
            <Text style={[globalStyles.text, styles.selectedTheme]}>
              {formatThemeLabel(selectedTheme)}
            </Text>
          }
          icon={ThemeIconImg}
          activity="Theme"
        />
        <ActivityItem
          isDarkMode={preferredTheme === Theme.DARK}
          onPress={handleOnPressAbout}
          style={styles.activityItem}
          icon={AboutIconImg}
          activity="About"
        />
      </ScrollView>
      <Modal isOpen={showThemeModal} onClose={() => setShowThemeModal(false)}>
        <Modal.Content
          maxWidth="400px"
          borderRadius={0}
          backgroundColor={
            preferredTheme === Theme.DARK
              ? GlobalColors.darkModeOverlay
              : undefined
          }>
          <Modal.Body>
            <Radio.Group
              name="myRadioGroup"
              accessibilityLabel="favorite number"
              value={selectedTheme}
              onChange={nextValue => {
                handleOnChangeTheme(nextValue as Theme);
              }}>
              <Radio value={Theme.FOLLOW_SYSTEM} my={1}>
                <Text
                  style={
                    preferredTheme === Theme.DARK
                      ? globalStyles.darkModeText
                      : globalStyles.text
                  }>
                  Follow System
                </Text>
              </Radio>
              <Radio value={Theme.LIGHT} my={1}>
                <Text
                  style={
                    preferredTheme === Theme.DARK
                      ? globalStyles.darkModeText
                      : globalStyles.text
                  }>
                  Light
                </Text>
              </Radio>
              <Radio value={Theme.DARK} my={1}>
                <Text
                  style={
                    preferredTheme === Theme.DARK
                      ? globalStyles.darkModeText
                      : globalStyles.text
                  }>
                  Dark
                </Text>
              </Radio>
            </Radio.Group>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    ...globalStyles.text,
    fontWeight: '500',
    fontSize: normalizeFont(20),
    marginBottom: 24,
  },
  activityItem: {
    marginBottom: 24,
  },
  selectedTheme: {
    color: GlobalColors.primary,
  },
});

export default Settings;
