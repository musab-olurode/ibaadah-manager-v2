import React, {useRef, useMemo, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
} from 'react-native';
import {globalFonts, globalStyles, normalizeFont} from '../styles/global';
import PagerView, {
  PagerViewOnPageScrollEventData,
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import Onboarding1Img from '../assets/onboarding/onboarding-1.png';
import Onboarding2Img from '../assets/onboarding/onboarding-2.png';
import Onboarding3Img from '../assets/onboarding/onboarding-3.png';
import IbaadahEllipseImg from '../assets/onboarding/ibaadah-ellipse.svg';
import RemindersEllipseImg from '../assets/onboarding/reminders-ellipse.svg';
import LightbulbImg from '../assets/onboarding/lightbulb.svg';
import Button from '../components/Button';
import PageIndicator from '../components/onboarding/PageIndicator';
import {Modal} from 'native-base';
import Input from '../components/Input';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {setOnboardingState} from '../utils/onboarding';
import {setUser} from '../utils/storage';
import {useAppDispatch} from '../redux/hooks';
import {setUserDetails} from '../redux/user/userSlice';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const Onboarding = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [errorInputText, setErrorInput] = useState('');

  const pagerRef = useRef<PagerView>(null);
  const homeNavigation =
    useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

  const width = Dimensions.get('window').width;

  const dispatch = useAppDispatch();

  const ONBOARDING_DATA = [
    {
      icon: Onboarding1Img,
      text: (
        <View>
          <Text style={[globalStyles.text, styles.pageText]}>Manage your</Text>
          <View>
            <Text style={[globalStyles.text, styles.pageText]}>Ibaadah</Text>
            <IbaadahEllipseImg style={styles.ellipse} />
          </View>
          <Text style={[globalStyles.text, styles.pageText]}>
            quickly{' '}
            <View>
              <LightbulbImg style={styles.lightbulb} />
            </View>
          </Text>
        </View>
      ),
    },
    {
      icon: Onboarding2Img,
      text: (
        <View>
          <Text style={[globalStyles.text, styles.pageText]}>
            Get{' '}
            <View>
              <View style={styles.remindersContainer}>
                <Text style={[globalStyles.text, styles.pageText]}>
                  reminders
                </Text>
                <RemindersEllipseImg style={styles.ellipse} />
              </View>
            </View>
          </Text>
          <Text style={[globalStyles.text, styles.pageText]}>
            for uncompleted
          </Text>
          <Text style={[globalStyles.text, styles.pageText]}>
            Ibaadah{' '}
            <View>
              <LightbulbImg style={styles.lightbulb} />
            </View>
          </Text>
        </View>
      ),
    },
    {
      icon: Onboarding3Img,
      text: (
        <Text style={[globalStyles.text, styles.pageText]}>
          {'Keep track of your\nDaily, Weekly and\nMonthly Ibaadah'}
        </Text>
      ),
    },
  ];

  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;
  const inputRange = [0, ONBOARDING_DATA.length];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, ONBOARDING_DATA.length * width],
  });

  const onPageScroll = useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleOnPageSelected = (event: PagerViewOnPageSelectedEvent) => {
    setCurrentPageIndex(event.nativeEvent.position);
  };

  const handleOnPressNext = () => {
    if (currentPageIndex !== ONBOARDING_DATA.length - 1) {
      pagerRef.current?.setPage(currentPageIndex + 1);
    }
  };

  const handleOnPressStartOrSkip = () => {
    pagerRef.current?.setPage(ONBOARDING_DATA.length - 1);
    setModalVisible(true);
  };

  const handleOnSubmitName = async () => {
    if (!name) {
      setErrorInput('Please Input a Name');
    } else if (name.length < 2) {
      setErrorInput('Please Input a valid Name');
    } else {
      dispatch(setUserDetails({name}));
      await setUser({name});
      await setOnboardingState('true');

      homeNavigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.skipContainer}>
        {currentPageIndex !== ONBOARDING_DATA.length - 1 && (
          <Text
            style={[globalStyles.text, styles.skipText]}
            onPress={handleOnPressStartOrSkip}>
            Skip
          </Text>
        )}
      </View>
      <AnimatedPagerView
        style={styles.pagerView}
        initialPage={0}
        ref={pagerRef}
        onPageScroll={onPageScroll}
        onPageSelected={handleOnPageSelected}>
        {ONBOARDING_DATA.map((data, index) => (
          <View key={`page-${index}`}>
            <View style={styles.pageContent}>
              <Image
                resizeMode="contain"
                style={[styles.pageIcon]}
                source={data.icon}
              />
              <View>{data.text}</View>
            </View>
          </View>
        ))}
      </AnimatedPagerView>
      <View style={styles.footer}>
        <PageIndicator data={ONBOARDING_DATA} scrollX={scrollX} />
        {currentPageIndex === ONBOARDING_DATA.length - 1 ? (
          <Button
            text="Get Started"
            variant="solid"
            style={styles.nextBtn}
            onPress={handleOnPressStartOrSkip}
          />
        ) : (
          <Button
            text="Next"
            variant="solid"
            style={styles.nextBtn}
            onPress={handleOnPressNext}
          />
        )}
      </View>

      <Modal isOpen={modalVisible} avoidKeyboard>
        <Modal.Content>
          <View style={styles.modalBody}>
            <Text style={globalStyles.text}>What should we call you</Text>
            <Input
              placeholder="Enter your name"
              style={styles.nameInput}
              onChangeText={text => setName(text)}
            />
            <Text style={styles.errorInputText}>{errorInputText}</Text>
            <Button
              text="Save"
              variant="solid"
              style={styles.saveBtn}
              onPress={handleOnSubmitName}
            />
          </View>
        </Modal.Content>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 25,
    overflow: 'visible',
  },
  skipText: {
    ...globalFonts.aeonik.regular,
  },
  pagerView: {
    flex: 1,
  },
  pageContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  pageIcon: {
    width: '100%',
    height: 349,
  },
  pageText: {
    fontSize: normalizeFont(32),
    ...globalFonts.spaceGrotesk.bold,
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    textAlignVertical: 'bottom',
  },
  lightbulb: {
    marginBottom: -15,
    marginLeft: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextBtn: {
    paddingVertical: 16,
    paddingHorizontal: 32,
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
  ellipse: {
    position: 'absolute',
    zIndex: -1,
    left: 0,
    bottom: 0,
  },
  remindersContainer: {
    marginBottom: -8,
  },
});

export default Onboarding;
