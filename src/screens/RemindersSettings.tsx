import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import ActivityItem from '../components/ActivityItem';
import {RootNavigatorParamList} from '../navigators/RootNavigator';
import {GlobalColors, globalStyles, normalizeFont} from '../styles/global';
import {SOLAH} from '../utils/activities';
import {Pressable} from 'native-base';
import ChevronDownIconImg from '../assets/icons/small-chevron-down.svg';
import {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

const RemindersSettings = ({
  route,
}: NativeStackScreenProps<RootNavigatorParamList>) => {
  const {activity} =
    route.params as RootNavigatorParamList['RemindersSettings'];

  const handleOnChangeNotificationDate = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    switch (event.type) {
      case 'set':
        date!.setSeconds(0);
        date!.setMilliseconds(0);
        console.log(date!);
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

  return (
    <ScrollView style={globalStyles.container}>
      <View>
        {SOLAH.map((action, index) => (
          <ActivityItem
            key={index}
            hideStartIcon
            activity={action.title}
            style={styles.activityItem}
            showEndIcon
            customEndIcon={
              <Pressable
                style={styles.timePickerBtn}
                onPress={handleOnPressShowTimePicker}>
                <Text style={styles.timePickerBtnText}>05:40 AM</Text>
                <ChevronDownIconImg fill="white" style={styles.chevron} />
              </Pressable>
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    marginBottom: 24,
  },
  timePickerBtn: {
    backgroundColor: GlobalColors.primary,
    borderRadius: 100,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePickerBtnText: {
    ...globalStyles.text,
    color: 'white',
    fontSize: normalizeFont(12),
  },
  chevron: {
    marginLeft: 8,
  },
});

export default RemindersSettings;
