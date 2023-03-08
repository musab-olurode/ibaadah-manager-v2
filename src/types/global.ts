import {ActivityCategory} from '../utils/activities';

export enum FilterType {
  TODAY = 'TODAY',
  THIS_WEEK = 'THIS_WEEK',
  LAST_WEEK = 'LAST_WEEK',
  MONTHLY = 'MONTHLY',
}

export enum SubFilterType {
  INDIVIDUAL = 'INDIVIDUAL',
  TOTAL = 'TOTAL',
}

export interface GlossaryItem {
  word: string;
  definition: string;
}

export enum StorageKeys {
  USER = 'USER',
  ONBOARDING = 'ONBOARDING',
  ACTIVITIES = 'ACTIVITIES',
}

export interface Activity {
  icon: number;
  title: string;
  category: ActivityCategory;
  activity: string;
  completed: boolean;
}

export interface ActivityStorage {
  data: Activity[];
  date: string;
}

export interface GroupedActivityEvaluation {
  title: string;
  progress: number;
  completedCount: number;
  content: Activity[];
}
