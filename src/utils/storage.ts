import {StorageKeys, ReminderStorage} from '../types/global';
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

export const setReminder = async (state: ReminderStorage[], db: string) => {
  await AsyncStorage.setItem(db, JSON.stringify(state));
};
export const clearReminder = async (state: string) => {
  await AsyncStorage.removeItem(state);
};

export const setApiReminderData = async (data: string) => {
  await AsyncStorage.setItem(StorageKeys.APISOLAT, data);
};

export const getApiReminderData = async () => {
  return await AsyncStorage.getItem(StorageKeys.APISOLAT);
};

export const clearApiReminderData = async () => {
  await AsyncStorage.removeItem(StorageKeys.APISOLAT);
};

export const setUserLanguage = async (language: string) => {
  await AsyncStorage.setItem(StorageKeys.USER_LANGUAGE, language);
};

export const getUserLanguage = async () => {
  const language = await AsyncStorage.getItem(StorageKeys.USER_LANGUAGE);
  return language;
};
