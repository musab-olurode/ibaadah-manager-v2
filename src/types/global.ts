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
  sn: number;
  name: string;
  slug: string;
  definition: string;
  explanation: string;
}

export enum StorageKeys {
  USER = 'USER',
  ONBOARDING = 'ONBOARDING',
  ACTIVITIES = 'ACTIVITIES',
  DAILY_REMINDER = 'DAILY_REMINDER',
  WEEKLY_REMINDER = 'WEEKLY_REMINDER',
  MONTHLY_REMINDER = 'MONTHLY_REMINDER',
}

interface RawActivitySubActivity {
  icon: number;
  order: number;
  title: string;
}

export interface RawActivity {
  icon: number;
  group: string;
  activities: RawActivitySubActivity[];
}

export interface Activity {
  icon: number;
  order: number;
  group: string;
  category: ActivityCategory;
  title: string;
  completed: boolean;
}

export interface EvaluationGroup {
  title: string;
  group: string;
  category: ActivityCategory;
  completed: boolean;
}

export interface TotalEvaluationGroup {
  title: string;
  group: string;
  category: ActivityCategory;
  completedCount: number;
  totalCount: number;
}

export interface GroupedActivityEvaluation {
  title: string;
  group: string;
  progress: number;
  completedCount: number;
  totalCount: number;
  activities: EvaluationGroup[];
}

export interface TotalGroupedActivityEvaluation {
  group: string;
  progress: number;
  activities: TotalEvaluationGroup[];
}
export interface ReminderStorage {
  title: string;
  message: string;
  bigText?: string;
  particularActivity: string;
  hour: number;
  minute: number;
}
