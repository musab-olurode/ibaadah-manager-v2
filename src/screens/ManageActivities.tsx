import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View, Text, Pressable} from 'react-native';
import {globalStyles} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import CreateActivityIconImg from '../assets/icons/create-activity.png';
import EditActivityIconImg from '../assets/icons/edit-activity.png';
import DeleteActivityIconImg from '../assets/icons/delete-activity.png';
import {Checkbox, Modal} from 'native-base';
import Button from '../components/Button';
import Input from '../components/Input';
import ModalCloseIcon from '../assets/icons/modal-close.svg';
import {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {useIsFocused} from '@react-navigation/native';

const ManageActivities = ({
  route,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {category} = route.params as RootNavigatorParamList['ManageActivities'];
  const [modalVisible, setModalVisible] = useState(false);
  const [enableNotification, setEnableNotification] = useState(false);
  const [notificationTime, setNotificationTime] = useState(new Date());

  const isFocused = useIsFocused();

  const ACTIONS = [
    {
      icon: CreateActivityIconImg,
      name: `New Personal ${category} Activity`,
      disabled: false,
      onPress: handleOnPressCreateActivity,
    },
    {
      icon: EditActivityIconImg,
      name: `Remove Personal ${category} Activity`,
      disabled: true,
      onPress: () => {},
    },
    {
      icon: DeleteActivityIconImg,
      name: `Edit Personal ${category} Activity`,
      disabled: true,
      onPress: () => {},
    },
  ];

  function handleOnPressCreateActivity() {
    setModalVisible(true);
  }

  const formatSelectedTime = (date: Date) => {
    const timeString = date.toLocaleTimeString();
    const splitTime = timeString.split(' ');
    const timeWithoutMilliseconds = splitTime[0].split(':');
    return `${timeWithoutMilliseconds[0]}:${timeWithoutMilliseconds[1]} ${splitTime[1]}`;
  };

  const handleOnChangeNotificationDate = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    switch (event.type) {
      case 'set':
        date!.setSeconds(0);
        date!.setMilliseconds(0);
        setNotificationTime(date!);
        break;
      default:
        break;
    }
  };

  const handleOnPressShowTimePicker = () => {
    DateTimePickerAndroid.open({
      mode: 'time',
      value: new Date(),
      onChange: handleOnChangeNotificationDate,
    });
  };

  const handleOnSubmitName = () => {};

  useEffect(() => {
    const now = new Date();
    now.setHours(19);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    setNotificationTime(now);
  }, [isFocused]);

  return (
    <ScrollView style={globalStyles.container}>
      {ACTIONS.map((action, index) => (
        <ActivityItem
          key={index}
          icon={action.icon}
          activity={action.name}
          style={styles.activityItem}
          disabled={action.disabled}
          onPress={action.onPress}
        />
      ))}
      <Modal
        isOpen={modalVisible}
        avoidKeyboard
        onClose={() => setModalVisible(false)}
        size="xl">
        <Modal.Content>
          <View style={styles.modalBody}>
            <View style={styles.modalHeader}>
              <Pressable
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}>
                <ModalCloseIcon />
              </Pressable>
              <Text
                style={[
                  globalStyles.text,
                  styles.modalHeaderText,
                ]}>{`New ${category} Activity`}</Text>
            </View>
            <Input
              placeholder="Activity Title"
              style={[styles.input, styles.topInput]}
            />
            <Input
              placeholder="Activity Details"
              style={[styles.input, styles.bottomInput]}
            />
            <View style={styles.notificationSettings}>
              <Checkbox
                value="enable-notifications"
                onChange={isSelected => setEnableNotification(isSelected)}>
                Enable Notifications
              </Checkbox>

              <Pressable
                disabled={!enableNotification}
                style={[
                  styles.timeIndicator,
                  !enableNotification && styles.disabledBtn,
                ]}
                onPress={handleOnPressShowTimePicker}>
                <Text style={globalStyles.text}>
                  {formatSelectedTime(notificationTime)}
                </Text>
              </Pressable>
            </View>
            <Button
              text="Add"
              variant="outline"
              style={styles.createActivityBtn}
              onPress={handleOnSubmitName}
            />
          </View>
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    marginBottom: 24,
  },
  modalBody: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    paddingHorizontal: 32,
  },
  topInput: {
    marginTop: 40,
    marginBottom: 16,
  },
  bottomInput: {
    marginBottom: 40,
  },
  createActivityBtn: {
    marginTop: 31,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    width: '100%',
  },
  closeBtn: {
    marginRight: 24,
  },
  modalHeaderText: {
    fontWeight: '500',
  },
  notificationSettings: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeIndicator: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#BBDACE',
    padding: 16,
    backgroundColor: 'white',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});

export default ManageActivities;
