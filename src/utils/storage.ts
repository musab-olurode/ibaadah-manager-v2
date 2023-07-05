import {ColorMode} from 'native-base';
import {StorageKeys, Theme} from '../types/global';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  name: string;
  avatarPath?: string;
}

export const getUser = async (): Promise<User> => {
  const stringifiedState = await AsyncStorage.getItem(StorageKeys.USER);

  if (!stringifiedState) {
    return {name: '', avatarPath: ''};
  }
  const state = JSON.parse(stringifiedState);

  return state as User;
};

export const setUser = async (state: User) => {
  await AsyncStorage.setItem(StorageKeys.USER, JSON.stringify(state));
};

export const setUserLanguage = async (language: string) => {
  await AsyncStorage.setItem(StorageKeys.USER_LANGUAGE, language);
};

export const getUserLanguage = async () => {
  const language = await AsyncStorage.getItem(StorageKeys.USER_LANGUAGE);
  return language;
};

export const setTheme = async (theme: Theme) => {
  await AsyncStorage.setItem(StorageKeys.THEME, theme);
};

export const getTheme = async () => {
  const theme = await AsyncStorage.getItem(StorageKeys.THEME);
  return theme as Theme | null;
};

export const setNativeBaseColorMode = async (colorMode: ColorMode) => {
  await AsyncStorage.setItem(StorageKeys.COLOR_MODE, colorMode as string);
};

export const getNativeBaseColorMode = async () => {
  const colorMode = await AsyncStorage.getItem(StorageKeys.COLOR_MODE);
  return colorMode as ColorMode | null;
};
