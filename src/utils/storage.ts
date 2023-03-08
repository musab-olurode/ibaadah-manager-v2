import {ActivityStorage, StorageKeys} from '../types/global';
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

export const getActivities = async (): Promise<ActivityStorage[]> => {
  const stringifiedState = await AsyncStorage.getItem(StorageKeys.ACTIVITIES);

  if (!stringifiedState) {
    return [];
  }
  const state = JSON.parse(stringifiedState);

  return state as ActivityStorage[];
};

export const setActivities = async (state: ActivityStorage[]) => {
  await AsyncStorage.setItem(StorageKeys.ACTIVITIES, JSON.stringify(state));
};
