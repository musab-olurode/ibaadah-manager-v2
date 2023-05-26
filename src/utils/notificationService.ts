import PushNotification, {Importance} from 'react-native-push-notification';
import {getUser} from '../utils/storage';

// let latitude: string = '11.983613816899279';
// let longitude: string = '8.43155822638075';
const day = new Date().getDate();
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();
const API_URL = (latitude: number, longitude: number) =>
  `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=5`;
// const API_URL = 'http://10.0.2.2:8000/ibaadah';
// const API_URL = 'http://192.168.0.102:8000/ibaadah';

export const fetchSolatTimeAPI = async (
  longitude: number,
  latitude: number,
) => {
  try {
    const response = await fetch(API_URL(longitude, latitude));
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
};

let username: string;
getUser().then(user => (username = user.name));

export const createChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'ibaadah-id',
      channelName: 'My Ibaadah Manager',
      vibrate: true,
      importance: Importance.HIGH,
      playSound: true,
      soundName: 'narutojutsu.mp3',
    },
    created => {
      console.log(`Notification channel created successfully '${created}'`);
    },
  );
};

export const setPushNotifcation = (
  message: string,
  activity: string,
  date: Date,
  index: number,
  repeatType: 'day' | 'week' | 'time',
  repeatTime: number,
  t: Function,
  ignore?: boolean,
) => {
  PushNotification.localNotificationSchedule({
    channelId: 'ibaadah-id',
    message,
    title: activity,
    bigText: `${t('common:salam')} ${username}, ${message}`,
    date: date!,
    allowWhileIdle: true,
    vibrate: true,
    playSound: true,
    soundName: 'narutojutsu.mp3',
    repeatType,
    repeatTime,
    id: index,
    priority: 'high',
    ignoreInForeground: ignore || false,
  });
};

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

export const getOrdinalSuffix = (n: number) => {
  let ord = 'th';

  if (n % 10 === 1 && n % 100 !== 11) {
    ord = 'st';
  } else if (n % 10 === 2 && n % 100 !== 12) {
    ord = 'nd';
  } else if (n % 10 === 3 && n % 100 !== 13) {
    ord = 'rd';
  }

  return ord;
};

export const notificationMessage = (
  date: Date,
  reminderParams: string,
  activity: string,
  category: string,
  t: Function,
) => {
  const customActivityMessage = () => {
    switch (activity) {
      case t('common:solah'):
        return `time for ${reminderParams} prayer`;

      case t('common:nawafil'):
        return `time to observe ${reminderParams}`;

      case t('common:adhkar'):
        return `time for your ${reminderParams} ${activity}`;

      case t('common:books'):
        return `time for ${reminderParams} reading`;

      case t('common:fasting'):
        return `time for ${reminderParams}'s ${activity}`;

      case t('common:sadaqah'):
        return `time to ${reminderParams.toLowerCase()}`;

      case t('common:familySitting'):
        return `time to ${
          reminderParams.startsWith('Discussion')
            ? 'discuss with your family'
            : reminderParams
        }`;

      case t('common:savingMoney'):
        return `time to save money ${reminderParams.toLowerCase()}`;

      case t('common:ziyaarah'):
        return `time ${
          reminderParams === t('common:soliheen') ? 'for Ziyaaratul-' : 'to '
        }${reminderParams}`;

      case t('common:savingMoney'):
        return `time to save money ${reminderParams.toLowerCase()}`;

      default:
        return `time for ${reminderParams}`;
    }
  };

  const timeGenerate = () => {
    return `${
      date!.getHours() < 13 ? date!.getHours() : date!.getHours() - 12
    }:${date!.getMinutes() < 10 ? 0 : ''}${date?.getMinutes()} ${
      date!.getHours() < 12 ? 'AM' : 'PM'
    }`;
  };

  if (category === 'Daily') {
    return `It's ${timeGenerate()}, ${customActivityMessage()}`;
  } else if (category === 'Weekly') {
    return `It's ${date.toLocaleDateString('en-US', {
      weekday: 'long',
    })} ${timeGenerate()}, ${customActivityMessage()}`;
  } else {
    return `It's ${date!.getDate()}${getOrdinalSuffix(date!.getDate())} of ${
      monthNames[date!.getMonth()]
    }, ${customActivityMessage()}`;
  }
};

export const ShowNotifications = () => {
  PushNotification.getScheduledLocalNotifications(i => console.log(i));
};

export const cancelAllNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
};
