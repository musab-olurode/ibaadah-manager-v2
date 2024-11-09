export interface User {
  name: string;
  avatarPath?: string;
}

export enum ActivityCategory {
  Solah = 'Solah',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

export enum ActivityType {
  INBUILT = 'INBUILT',
  CUSTOM = 'CUSTOM',
}

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

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  FOLLOW_SYSTEM = 'FOLLOW_SYSTEM',
}

export interface GlossaryItem {
  sn: number;
  name: string;
  slug: string;
  definition: string;
  explanation: string;
}

export enum StorageKeys {
  USER = '@USER',
  ONBOARDING = '@ONBOARDING',
  ACTIVITIES = '@ACTIVITIES',
  USER_LANGUAGE = '@USER_LANGUAGE',
  THEME = '@THEME',
  COLOR_MODE = '@COLOR_MODE',
  COORDINATES = '@COORDINATES',
  DAILY_REMINDER = '@DAILY_REMINDER',
  WEEKLY_REMINDER = '@WEEKLY_REMINDER',
  MONTHLY_REMINDER = '@MONTHLY_REMINDER',
  API_REMINDER_DATA = '@API_REMINDER_DATA',
}

export enum NotificationChannelId {
  REMINDERS = 'reminders',
}

export interface Coordinates {
  latitude: number;
  longitude: number;
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
  category: ActivityCategory;
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
  group: string;
  message: string;
  bigText?: string;
  title: string;
  hour: number;
  minute: number;
  date?: number;
  day?: string;
  month?: number;
}

export interface SolahApiData {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
    Firstthird: string;
    Lastthird: string;
  };
  date: {
    readable: string;
    timestamp: string;
    hijri: {
      date: string;
      format: string;
      day: string;
      weekday: {
        en: string;
        ar: string;
      };
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
      designation: {
        abbreviated: string;
        expanded: string;
      };
      holidays: any[];
    };
    gregorian: {
      date: string;
      format: string;
      day: string;
      weekday: {
        en: string;
      };
      month: {
        number: number;
        en: string;
      };
      year: string;
      designation: {
        abbreviated: string;
        expanded: string;
      };
    };
  };
  coordinates: Coordinates;
}
