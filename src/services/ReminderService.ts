import PushNotification, {Importance} from 'react-native-push-notification';
import {
  getApiReminderData,
  getCoordinates,
  getUser,
  setApiReminderData,
} from '../utils/storage';
import {
  Coordinates,
  NotificationChannelId,
  SolahApiData,
} from '../types/global';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {RequestService} from './RequestService';
import {
  REMINDER_CHANNEL_DESCRIPTION,
  REMINDER_CHANNEL_NAME,
  REMINDER_TONE,
} from '../utils/constants';
import {getOrdinalSuffix} from '../utils/global';
import {Reminder} from '../database/entities/Reminder';
import {AppDataSource} from '../database/config';
import {FindOptionsWhere} from 'typeorm';
import i18next from 'i18next';

// let latitude: string = '11.983613816899279';
// let longitude: string = '8.43155822638075';

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export class ReminderService {
  private static reminderRepository = AppDataSource.getRepository(Reminder);
  private static t = i18next.t;

  static async find(filter?: FindOptionsWhere<Reminder>) {
    const activities = await this.reminderRepository.find({where: filter});
    return activities;
  }

  static async create(reminder: Reminder) {
    const newReminder = this.reminderRepository.create(reminder);
    return await this.reminderRepository.save(newReminder);
  }

  static async createMany(activities: Reminder[]) {
    const newActivities = this.reminderRepository.create(activities);
    return await this.reminderRepository.save(newActivities);
  }

  static async checkNotificationPermission() {
    if (Platform.OS === 'android') {
      try {
        const isGrantedNotificationPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (!isGrantedNotificationPermission) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        }
      } catch (error) {}
    }
  }

  static createNotificationChannel() {
    PushNotification.channelExists(
      NotificationChannelId.REMINDERS,
      function (exists) {
        if (!exists) {
          PushNotification.createChannel(
            {
              channelId: NotificationChannelId.REMINDERS,
              channelName: REMINDER_CHANNEL_NAME,
              channelDescription: REMINDER_CHANNEL_DESCRIPTION,
              vibrate: true,
              importance: Importance.HIGH,
              playSound: true,
              soundName: REMINDER_TONE,
            },
            () => {},
          );
        }
      },
    );
  }

  static async getUserCoordinates() {
    let coordinates = await getCoordinates();
    let errorMessage: undefined | string;

    Geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        coordinates = {latitude, longitude};
      },
      error => {
        errorMessage = error.message;
      },
      {
        enableHighAccuracy: false,
      },
    );

    return {
      coordinates,
      errorMessage,
    };
  }

  private static async resolveSolahTimings(
    apiReminderData: SolahApiData,
    coordinates: Coordinates,
  ) {
    const locationChangedSignificantly =
      Math.trunc(apiReminderData.coordinates.latitude) !==
        Math.trunc(coordinates.latitude) ||
      Math.trunc(apiReminderData.coordinates.longitude) !==
        Math.trunc(coordinates.longitude);
    const isDifferentDay =
      Number(apiReminderData.date.gregorian.day) !== new Date().getDate();

    if (locationChangedSignificantly || isDifferentDay) {
      apiReminderData = await RequestService.getSolahTimings();
      setApiReminderData(apiReminderData);
    }

    return apiReminderData;
  }

  static async getUserSolahTimings() {
    let apiReminderData = await getApiReminderData();
    const {coordinates} = await this.getUserCoordinates();

    if (apiReminderData) {
      apiReminderData = await this.resolveSolahTimings(
        apiReminderData,
        coordinates,
      );
    } else {
      const rawSolahTimingsData = await RequestService.getSolahTimings();
      const parsedSolahTimingsData: SolahApiData = {
        date: rawSolahTimingsData.data.date,
        timings: rawSolahTimingsData.data.timings,
        coordinates,
      };
      setApiReminderData(parsedSolahTimingsData);
      apiReminderData = await this.resolveSolahTimings(
        parsedSolahTimingsData,
        coordinates,
      );
    }

    return apiReminderData;
  }

  static async setPushNotification(
    message: string,
    title: string,
    date: Date,
    index: number,
    repeatType: 'day' | 'week' | 'time',
    repeatTime: number,
    ignoreInForeground?: boolean,
  ) {
    const username = (await getUser()).name;

    PushNotification.localNotificationSchedule({
      channelId: NotificationChannelId.REMINDERS,
      message,
      title,
      bigText: this.t('common:reminderMessage', {username, message}),
      date: date,
      soundName: REMINDER_TONE,
      repeatType,
      repeatTime,
      ignoreInForeground,
      id: index,
      allowWhileIdle: true,
      vibrate: true,
      playSound: true,
      priority: 'high',
    });
  }

  static getNotificationMessage(
    date: Date,
    reminderParams: string,
    activity: string,
    category: string,
  ) {
    const customActivityMessage = () => {
      switch (activity) {
        case this.t('common:solah'):
          return this.t('common:solahReminder', {solah: reminderParams});

        case this.t('common:nawafil'):
          return this.t('common:nawafilReminder', {nawafil: reminderParams});

        case this.t('common:adhkar'):
          return this.t('common:adhkarReminder', {
            time: reminderParams,
            adhkar: activity,
          });

        case this.t('common:books'):
          return this.t('common:booksReminder', {book: reminderParams});

        case this.t('common:fasting'):
          return this.t('common:fastingReminder', {
            time: reminderParams,
            fast: activity,
          });

        case this.t('common:sadaqah'):
          return this.t('common:sadaqahReminder', {sadaqah: reminderParams});

        case this.t('common:familySitting'):
          return this.t('common:familySittingReminder', {
            sitting: reminderParams,
          });

        case this.t('common:savingMoney'):
          return this.t('common:savingMoneyReminder', {
            savings: reminderParams,
          });

        case this.t('common:ziyaarah'):
          return this.t('common:ziyaarahReminder', {ziyaarah: reminderParams});

        default:
          return this.t('common:fallbackReminder', {activity: reminderParams});
      }
    };

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const message = customActivityMessage();

    let formattedNotificationMessage = '';

    if (category === 'Daily') {
      formattedNotificationMessage = this.t('common:dailyReminder', {
        time: formattedTime,
        message,
      });
    } else if (category === 'Weekly') {
      const weekday = date.toLocaleDateString('en-US', {
        weekday: 'long',
      });

      formattedNotificationMessage = this.t('common:weeklyReminder', {
        weekday,
        time: formattedTime,
        message,
      });
    } else {
      const day = date!.getDate(),
        suffix = getOrdinalSuffix(day),
        month = monthNames[date!.getMonth()];
      const formattedDay = `${day}${suffix}`;

      formattedNotificationMessage = this.t('common:monthlyReminder', {
        day: formattedDay,
        suffix,
        month,
        message,
      });
    }

    return formattedNotificationMessage;
  }

  static showNotifications() {
    PushNotification.getScheduledLocalNotifications(i => console.log(i));
  }

  static cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }
}
