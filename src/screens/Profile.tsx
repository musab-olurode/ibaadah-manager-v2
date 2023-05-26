import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Pressable,
  PermissionsAndroid,
} from 'react-native';
import {
  GlobalColors,
  globalFonts,
  globalStyles,
  normalizeFont,
} from '../styles/global';
import ActivityItem from '../components/ActivityItem';
import DailyActivitiesIconImg from '../assets/icons/daily-activities.png';
import WeeklyActivitiesIconImg from '../assets/icons/weekly-activities.png';
import MonthlyActivitiesIconImg from '../assets/icons/monthly-activities.png';
import AvatarImg from '../assets/avatar.png';
import EditIconImg from '../assets/icons/edit.svg';
import GlossaryIconImg from '../assets/icons/glossary.png';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileNavigatorParamList} from '../navigators/ProfileNavigator';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  Asset,
  CameraOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import {setUser} from '../utils/storage';
import {Modal, useToast} from 'native-base';
import Input from '../components/Input';
import Button from '../components/Button';
import {setUserDetails} from '../redux/user/userSlice';
import RNFS from 'react-native-fs';
import {avatarFolder} from '../utils/constants';
import {useTranslation} from 'react-i18next';
import {ActivityCategory} from '../types/global';

const Profile = ({
  navigation,
}: NativeStackScreenProps<ProfileNavigatorParamList>) => {
  const user = useAppSelector(state => state.user);
  const [avatarPreview, setAvatarPreview] = useState<Asset>({
    uri: user.avatarPath ? `file://${user.avatarPath}` : undefined,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(user.name);
  const [errorInputText, setErrorInput] = useState('');
  const {t} = useTranslation();
  const toast = useToast();

  const dispatch = useAppDispatch();

  const ACTIONS = [
    {
      icon: DailyActivitiesIconImg,
      name: t('common:dailyActivitiesEvaluation'),
      onPress: () =>
        handleOnPressCreateActivity('EvaluationList', ActivityCategory.Daily),
    },
    {
      icon: WeeklyActivitiesIconImg,
      name: t('common:weeklyActivitiesEvaluation'),
      onPress: () =>
        handleOnPressCreateActivity('EvaluationList', ActivityCategory.Weekly),
    },
    {
      icon: MonthlyActivitiesIconImg,
      name: t('common:monthlyActivitiesEvaluation'),
      onPress: () =>
        handleOnPressCreateActivity('EvaluationList', ActivityCategory.Monthly),
    },
  ];

  function handleOnPressCreateActivity(
    screen: keyof ProfileNavigatorParamList,
    category: ProfileNavigatorParamList['EvaluationList']['category'],
  ) {
    navigation.push(screen, {category});
  }

  const editAvatar = async () => {
    const hasPermission = await requestFilePermission();
    if (!hasPermission) {
      return;
    }
    await RNFS.mkdir(avatarFolder);
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 1,
      cameraType: 'front',
    };
    const imageResponse = await launchImageLibrary(options);
    if (imageResponse.assets && imageResponse.assets.length > 0) {
      const avatar = imageResponse.assets[0];
      const newAvatarName = avatar.fileName!.replace(
        /(.*)\.(.*)/,
        `avatar${new Date().getTime()}.$2`,
      );

      let fileExists = false;

      if (user.avatarPath) {
        fileExists = await RNFS.exists(user.avatarPath as string).then(
          exists => exists,
        );
      }

      if (fileExists) {
        await RNFS.unlink(user.avatarPath!);
      }

      RNFS.copyFile(
        avatar.uri as string,
        `${avatarFolder}/${newAvatarName}`,
      ).then(() => RNFS.scanFile(`${avatarFolder}/${newAvatarName}`));

      setAvatarPreview({
        ...avatar,
        uri: `file://${avatarFolder}/${newAvatarName}`,
      });
      const userUpdate = {
        ...user,
        avatarPath: `${avatarFolder}/${newAvatarName}`,
      };
      await setUser(userUpdate);
      dispatch(setUserDetails(userUpdate));
    }
  };

  const handleOnSubmitName = async () => {
    if (!name) {
      setErrorInput('Please Input a Name');
    } else if (name.length < 2) {
      setErrorInput('Please Input a valid Name');
    } else {
      dispatch(setUserDetails({...user, name}));
      await setUser({name});
      setModalVisible(false);
    }
  };

  const handleOnPressGotoGlossary = () => {
    navigation.push('Glossary');
  };

  const requestFilePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: t('common:photoPermissionTitle'),
          message: t('common:photoPermissionMessage'),
          buttonNeutral: t('common:askMeLater') as string,
          buttonNegative: t('common:cancel') as string,
          buttonPositive: t('common:ok'),
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        toast.show({
          title: t('common:photoPermissionDenied'),
        });
        return false;
      }
    } catch (err: any) {
      toast.show({
        title: err.message,
      });
      return false;
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Pressable onPress={editAvatar}>
            <Image
              source={avatarPreview.uri ? avatarPreview : AvatarImg}
              style={styles.avatar}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable
            style={styles.editProfileBtn}
            onPress={() => setModalVisible(true)}>
            <EditIconImg />
          </Pressable>
        </View>

        <Text style={styles.name}>{user.name}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t('common:selfEvaluation')}</Text>

      <View>
        {ACTIONS.map((action, index) => (
          <ActivityItem
            key={index}
            icon={action.icon}
            activity={action.name}
            style={styles.activityItem}
            onPress={action.onPress}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t('common:glossary')}</Text>

      <ActivityItem
        icon={GlossaryIconImg}
        activity={t('common:meaningOfWords') as string}
        style={[styles.activityItem, styles.glossaryItem]}
        onPress={handleOnPressGotoGlossary}
      />
      <Modal isOpen={modalVisible} avoidKeyboard>
        <Modal.Content>
          <View style={styles.modalBody}>
            <Text style={globalStyles.text}>What should we call you</Text>
            <Input
              placeholder={t('common:enterName') as string}
              defaultValue={name}
              style={styles.nameInput}
              onChangeText={text => setName(text)}
            />
            <Text style={styles.errorInputText}>{errorInputText}</Text>
            <Button
              text={t('common:save') as string}
              variant="solid"
              style={styles.saveBtn}
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
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: GlobalColors.primary,
    width: 'auto',
    position: 'relative',
  },
  avatar: {
    borderRadius: 100,
    margin: 8.16,
    width: 120,
    height: 120,
  },
  name: {
    ...globalStyles.text,
    fontWeight: '500',
    fontSize: normalizeFont(24),
    marginTop: 16,
    marginBottom: 51,
  },
  editProfileBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 9,
    borderRadius: 100,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 24,
  },
  sectionTitle: {
    ...globalStyles.text,
    fontWeight: '500',
    fontSize: normalizeFont(20),
    marginBottom: 16,
  },
  glossaryItem: {
    marginBottom: 48,
  },
  modalBody: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 49,
    paddingHorizontal: 16,
  },
  nameInput: {
    marginTop: 40,
    marginBottom: 10,
    height: 40,
    paddingHorizontal: 32,
  },
  errorInputText: {
    marginVertical: 20,
    color: 'red',
    ...globalFonts.aeonik.regular,
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
});

export default Profile;
