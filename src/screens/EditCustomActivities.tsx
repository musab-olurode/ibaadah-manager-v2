import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Text, Image} from 'react-native';
import {GlobalColors, globalStyles, normalizeFont} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {Activity} from '../database/entities/Activity';
import {useIsFocused} from '@react-navigation/native';
import {ActivityService} from '../services/ActivityService';
import {ActivityType} from '../types/global';
import {FlatList, Checkbox, Modal, Actionsheet} from 'native-base';
import Button from '../components/Button';
import Input from '../components/Input';
import ModalCloseIcon from '../assets/icons/modal-close.svg';
import {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {CUSTOM_ACTIVITY_ICONS} from '../utils/activities';
import ChevronDownIconImg from '../assets/icons/chevron-down.svg';

const EditCustomActivities = ({
  route,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {category} =
    route.params as RootNavigatorParamList['EditCustomActivities'];
  const [customActivities, setCustomActivities] = useState<Activity[]>([]);
  const [activityToEdit, setActivityToEdit] = useState<Activity>();
  const [modalVisible, setModalVisible] = useState(false);
  const [enableNotification, setEnableNotification] = useState(false);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [selectedCustomIcon, setSelectedCustomIcon] = useState(
    CUSTOM_ACTIVITY_ICONS[0],
  );
  const [openActionSheet, setOpenActionSheet] = useState(false);

  const isFocused = useIsFocused();

  const handleOnPressItem = (activity: Activity) => {
    const _selectedCustomIcon = CUSTOM_ACTIVITY_ICONS.find(
      customIcon => customIcon.icon === activity.icon,
    );
    setActivityToEdit(activity);
    setSelectedCustomIcon(_selectedCustomIcon!);
    setModalVisible(true);
  };

  const handleOnCloseCustomIconActionSheet = () => {
    setOpenActionSheet(false);
  };

  const handleOnSelectCustomIcon = (value: {name: string; icon: number}) => {
    setSelectedCustomIcon(value);
    handleOnCloseCustomIconActionSheet();
  };

  const handleOnPressShowSelectIcon = () => {
    setOpenActionSheet(true);
  };

  const renderItem = ({item}: {item: Activity}) => (
    <ActivityItem
      icon={item.icon}
      activity={item.title}
      style={styles.activityItem}
      onPress={() => handleOnPressItem(item)}
    />
  );

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

  const handleOnSubmitCustomActivity = async () => {
    await ActivityService.update(activityToEdit!.id, {
      ...activityToEdit!,
      icon: selectedCustomIcon.icon,
    });
    setActivityToEdit(undefined);
    await getCustomActivities();
    setModalVisible(false);
  };

  const handleOnEditCustomActivityTitle = (text: string) => {
    const _activityToEdit = activityToEdit;
    _activityToEdit!.title = text;
    setActivityToEdit(_activityToEdit);
  };

  const getCustomActivities = async () => {
    const activities = await ActivityService.find({
      type: ActivityType.CUSTOM,
      category,
    });
    setCustomActivities(activities);
  };

  useEffect(() => {
    getCustomActivities();
  }, [isFocused]);

  return (
    <>
      <FlatList
        style={globalStyles.container}
        data={customActivities}
        renderItem={renderItem}
      />
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
              defaultValue={activityToEdit?.title}
              onChangeText={handleOnEditCustomActivityTitle}
              style={[styles.input, styles.topInput]}
            />
            <Pressable
              style={styles.chooseCustomIconBtn}
              onPress={handleOnPressShowSelectIcon}>
              <Image
                style={styles.selectedCustomIconPreview}
                source={selectedCustomIcon.icon}
              />
              <Text style={styles.chooseCustomIconBtnText}>
                {selectedCustomIcon.name}
              </Text>
              <ChevronDownIconImg style={styles.chooseCustomIconChevron} />
            </Pressable>
            <View style={styles.notificationSettings}>
              <Checkbox
                value="enable-notifications"
                isDisabled
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
              text="Update"
              variant="outline"
              disabled={!activityToEdit || !activityToEdit.title}
              style={styles.createActivityBtn}
              onPress={handleOnSubmitCustomActivity}
            />
          </View>
        </Modal.Content>
      </Modal>
      <Actionsheet
        isOpen={openActionSheet}
        onClose={handleOnCloseCustomIconActionSheet}>
        <Actionsheet.Content>
          {CUSTOM_ACTIVITY_ICONS.map(customActivityIcon => (
            <Actionsheet.Item
              key={customActivityIcon.name}
              onPress={() => handleOnSelectCustomIcon(customActivityIcon)}>
              <View style={styles.customActivityIconItem}>
                <Image
                  style={styles.customActivityIcon}
                  source={customActivityIcon.icon}
                />
                <Text style={globalStyles.text}>{customActivityIcon.name}</Text>
              </View>
            </Actionsheet.Item>
          ))}
        </Actionsheet.Content>
      </Actionsheet>
    </>
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
    marginBottom: 20,
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
  filter: {
    ...globalStyles.text,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  customActivityIcon: {
    width: 38,
    height: 38,
    marginRight: 16,
  },
  customActivityIconItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chooseCustomIconBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingLeft: 10,
    marginBottom: 20,
  },
  chooseCustomIconChevron: {
    marginLeft: 'auto',
  },
  chooseCustomIconBtnText: {
    ...globalStyles.text,
    color: GlobalColors['gray.2'],
    fontSize: normalizeFont(16),
  },
  selectedCustomIconPreview: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
});

export default EditCustomActivities;
