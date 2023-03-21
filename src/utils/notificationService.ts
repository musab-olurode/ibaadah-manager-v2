import PushNotification, {Importance} from 'react-native-push-notification';

export const createChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'ibaadah-id',
      channelName: 'My Ibaadah Manager',
      playSound: true,
      vibrate: true,
      importance: Importance.HIGH,
    },
    created => {
      console.log(`Notification channel created successfully '${created}'`);
    },
  );
};
