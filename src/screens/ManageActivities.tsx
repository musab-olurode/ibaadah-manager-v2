import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  Image,
} from 'react-native';
import {GlobalColors, globalStyles, normalizeFont} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import CreateActivityIconImg from '../assets/icons/create-activity.png';
import EditActivityIconImg from '../assets/icons/edit-activity.png';
import DeleteActivityIconImg from '../assets/icons/delete-activity.png';
import {Actionsheet, Checkbox, Modal} from 'native-base';
import Button from '../components/Button';
import Input from '../components/Input';
import ModalCloseIcon from '../assets/icons/modal-close.svg';
import {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {useIsFocused} from '@react-navigation/native';
import {ActivityService} from '../services/ActivityService';
import {ActivityType} from '../types/global';
import {
  CUSTOM_ACTIVITY_ICONS,
  resolveActivityDetails,
} from '../utils/activities';
import ChevronDownIconImg from '../assets/icons/chevron-down.svg';
import {useTranslation} from 'react-i18next';

const ManageActivities = ({
  navigation,
  route,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {category} = route.params as RootNavigatorParamList['ManageActivities'];
  const [modalVisible, setModalVisible] = useState(false);
  const [enableNotification, setEnableNotification] = useState(false);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [customActivityTitle, setCustomActivityTitle] = useState('');
  const [lastActivityOrder, setLastActivityOrder] = useState(0);
  const [customActivityCount, setCustomActivityCount] = useState(0);
  const [selectedCustomIcon, setSelectedCustomIcon] = useState(
    CUSTOM_ACTIVITY_ICONS[0],
  );
  const [openActionSheet, setOpenActionSheet] = useState(false);
  const {t} = useTranslation();
  const isFocused = useIsFocused();

  const ACTIONS = [
    {
      icon: CreateActivityIconImg,
      name: t(`common:newPersonal${category}Activity`),
      onPress: () => handleOnPressCreateActivity(),
    },
    {
      icon: DeleteActivityIconImg,
      name: t(`common:editPersonal${category}Activity`),
      onPress: () => handleOnPressEditActivity(),
    },
    {
      icon: EditActivityIconImg,
      name: t(`common:removePersonal${category}Activity`),
      onPress: () => handleOnPressRemoveActivity(),
    },
  ];

  const handleOnPressCreateActivity = () => {
    setModalVisible(true);
  };

  const handleOnPressRemoveActivity = () => {
    if (customActivityCount > 0) {
      navigation.push('RemoveCustomActivities', {category});
    }
  };

  const handleOnPressEditActivity = () => {
    if (customActivityCount > 0) {
      navigation.push('EditCustomActivities', {category});
    }
  };

  const formatSelectedTime = (date: Date) => {
    const timeString = date.toLocaleTimeString();
    const splitTime = timeString.split(' ');
    const timeWithoutMilliseconds = splitTime[0].split(':');
    return `${timeWithoutMilliseconds[0]}:${timeWithoutMilliseconds[1]} ${splitTime[1]}`;
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
    const CUSTOM_ACTIVITY_GROUP = 'Custom';
    const newCustomActivity = {
      icon: selectedCustomIcon.icon,
      title: customActivityTitle,
      category,
      type: ActivityType.CUSTOM,
      order: lastActivityOrder + 1,
      group: CUSTOM_ACTIVITY_GROUP,
      completed: false,
    };
    await ActivityService.create(newCustomActivity);
    setCustomActivityTitle('');
    await getLastActivityOrder();
    await checkCustomActivityCount();
    setModalVisible(false);
  };

  const handleOnChangeCustomActivityTitle = (text: string) => {
    setCustomActivityTitle(text);
  };

  const getLastActivityOrder = async () => {
    const lastOrder = await ActivityService.getLowestActivityOrder();
    setLastActivityOrder(lastOrder);
  };

  const checkCustomActivityCount = async () => {
    const numberOfCustomActivities =
      await ActivityService.getCustomActivityCount(category);
    setCustomActivityCount(numberOfCustomActivities);
  };

  const handleDefaultNotificationTime = () => {
    const now = new Date();
    now.setHours(19);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    setNotificationTime(now);
  };

  useEffect(() => {
    handleDefaultNotificationTime();
    getLastActivityOrder();
    checkCustomActivityCount();
  }, [isFocused]);

  return (
    <>
      <ScrollView style={globalStyles.container}>
        {ACTIONS.map((action, index) => (
          <ActivityItem
            key={index}
            icon={action.icon}
            activity={action.name}
            style={styles.activityItem}
            disabled={index !== 0 && customActivityCount === 0}
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
                <Text style={[globalStyles.text, styles.modalHeaderText]}>
                  {t(`common:new${category}Activity`)}
                </Text>
              </View>
              <Input
                placeholder={t('common:activityTitle') as string}
                onChangeText={handleOnChangeCustomActivityTitle}
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
                  {t('common:enableNotifications')}
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
                text={t('common:add') as string}
                variant="outline"
                disabled={customActivityTitle.length === 0}
                style={styles.createActivityBtn}
                onPress={handleOnSubmitCustomActivity}
              />
            </View>
          </Modal.Content>
        </Modal>
      </ScrollView>
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
                <Text style={globalStyles.text}>
                  {resolveActivityDetails(customActivityIcon.name, t)}
                </Text>
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

export default ManageActivities;
