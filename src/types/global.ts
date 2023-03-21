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
  DAILY_REMINDER = 'DAILY_REMINDER',
  WEEKLY_REMINDER = 'WEEKLY_REMINDER',
  MONTHLY_REMINDER = 'MONTHLY_REMINDER',
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
export interface ReminderStorage {
  title: string;
  message: string;
  bigText?: string;
  particularActivity: string;
  hour: number;
  minute: number;
}
