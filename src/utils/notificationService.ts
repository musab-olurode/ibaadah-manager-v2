import PushNotification, {Importance} from 'react-native-push-notification';

export const createChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'ibaadah-id',
      channelName: 'My Ibaadah Manager',
      vibrate: true,
      importance: Importance.HIGH,
    },
    created => {
      console.log(`Notification channel created successfully '${created}'`);
    },
  );
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
