import {StorageKeys} from '../types/global';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OnboardingState = 'true' | 'false';

export async function getOnboardingState(): Promise<OnboardingState> {
  const state = await AsyncStorage.getItem(StorageKeys.ONBOARDING);

  if (!state) {
    return 'false';
  }

  return state as OnboardingState;
}

export async function setOnboardingState(state: OnboardingState) {
  await AsyncStorage.setItem(StorageKeys.ONBOARDING, state);
}
