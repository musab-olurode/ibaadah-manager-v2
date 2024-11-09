import {
  StorageKeys,
  Theme,
  ReminderStorage,
  Coordinates,
  User,
  SolahApiData,
} from '../types/global';
import {ColorMode} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ABUJA_COORDINATES} from './constants';

export const getUser = async (): Promise<User> => {
  const stringifiedState = await AsyncStorage.getItem(StorageKeys.USER);

  if (!stringifiedState) {
    return {name: '', avatarPath: ''} as User;
  }
  const state = JSON.parse(stringifiedState);

  return state as User;
};

export const setUser = async (state: User) => {
  await AsyncStorage.setItem(StorageKeys.USER, JSON.stringify(state));
};

export const getCoordinates = async () => {
  const stringifiedState = await AsyncStorage.getItem(StorageKeys.COORDINATES);

  if (!stringifiedState) {
    return ABUJA_COORDINATES as Coordinates;
  }
  const state = JSON.parse(stringifiedState);

  return state as Coordinates;
};

export const setCoordinates = async (state: Coordinates) => {
  await AsyncStorage.setItem(StorageKeys.COORDINATES, JSON.stringify(state));
};

export const setReminder = async (state: ReminderStorage[], db: string) => {
  await AsyncStorage.setItem(db, JSON.stringify(state));
};
export const clearReminder = async (state: string) => {
  await AsyncStorage.removeItem(state);
};

export const setApiReminderData = async (data: SolahApiData) => {
  await AsyncStorage.setItem(
    StorageKeys.API_REMINDER_DATA,
    JSON.stringify(data),
  );
};

export const getApiReminderData = async () => {
  const stringifiedState = await AsyncStorage.getItem(
    StorageKeys.API_REMINDER_DATA,
  );

  if (!stringifiedState) {
    return null;
  }

  const state = JSON.parse(stringifiedState);

  return state as SolahApiData;
};

export const clearApiReminderData = async () => {
  await AsyncStorage.removeItem(StorageKeys.API_REMINDER_DATA);
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
