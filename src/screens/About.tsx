import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  Linking,
  Pressable,
} from 'react-native';
import ActivityItem from '../components/ActivityItem';
import {GlobalColors, globalStyles} from '../styles/global';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppIconImg from '../assets/app-icon.png';
import GithubIconImg from '../assets/icons/github.png';
import BehanceIconImg from '../assets/icons/behance.png';
import {BEHANCE_LINK, GITHUB_REPO_LINK} from '../utils/constants';
import {version as appVersion} from '../../package.json';
import {ProfileNavigatorParamList} from '../navigators/ProfileNavigator';
import usePreferredTheme from '../hooks/usePreferredTheme';
import {Theme} from '../types/global';
import {useTranslation} from 'react-i18next';

const About = ({
  navigation,
}: NativeStackScreenProps<ProfileNavigatorParamList>) => {
  const preferredTheme = usePreferredTheme();
  const {t} = useTranslation();

  const LINKS = [
    {
      title: t('common:openSourceLicenses'),
      action: () => {},
    },
    {
      title: t('common:howItWorks'),
      action: () => handleOnPressExternalLink(BEHANCE_LINK),
    },
    {
      title: t('common:privacyPolicy'),
      action: () => {},
    },
  ];

  const EXTERNAL_LINKS = [
    {
      title: 'GitHub',
      address: GITHUB_REPO_LINK,
      icon: GithubIconImg,
    },
    {
      title: 'Behance',
      address: BEHANCE_LINK,
      icon: BehanceIconImg,
    },
  ];

  const handleOnPressExternalLink = async (url: string) => {
    await Linking.openURL(url);
  };

  return (
    <>
      <ScrollView
        style={[
          globalStyles.container,
          preferredTheme === Theme.DARK && globalStyles.darkModeContainer,
        ]}>
        <View style={styles.appIconContainer}>
          <Image style={styles.appIcon} source={AppIconImg} />
        </View>
        <ActivityItem
          isDarkMode={preferredTheme === Theme.DARK}
          style={styles.activityItem}
          hideStartIcon
          showEndIcon
          customEndIcon={
            <Text style={[globalStyles.text, styles.appVersion]}>
              {appVersion}
            </Text>
          }
          activity={t('common:version')}
        />
        {LINKS.map((link, index) => (
          <ActivityItem
            isDarkMode={preferredTheme === Theme.DARK}
            key={`link-${index}`}
            style={styles.activityItem}
            hideStartIcon
            activity={link.title}
            onPress={link.action}
          />
        ))}
        <View style={styles.divider} />
        <View style={styles.externalLinks}>
          {EXTERNAL_LINKS.map((link, index) => (
            <Pressable
              key={`external-link-${index}`}
              style={styles.externalLinkPressable}
              onPress={() => handleOnPressExternalLink(link.address)}>
              <Image style={styles.externalLinkIcon} source={link.icon} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  appIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 48,
  },
  appIcon: {
    width: 114,
    height: 114,
  },
  activityItem: {
    marginBottom: 24,
  },
  appVersion: {
    color: GlobalColors.primary,
  },
  divider: {
    marginTop: 32,
    marginBottom: 22,
    borderTopWidth: 0.5,
    borderTopColor: GlobalColors.gray,
  },
  externalLinks: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  externalLinkPressable: {
    marginRight: 12,
  },
  externalLinkIcon: {
    width: 32,
    height: 32,
  },
});

export default About;
