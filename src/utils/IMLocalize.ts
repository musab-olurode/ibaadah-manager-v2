import i18n, {LanguageDetectorAsyncModule} from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import {getUserLanguage, setUserLanguage} from './storage';

import en from './translations/en';

const LANGUAGES = {
  en,
};

const LANG_CODES = Object.keys(LANGUAGES);

const LANGUAGE_DETECTOR: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    const userLanguage = await getUserLanguage();
    let availableLanguage = userLanguage;
    if (!userLanguage) {
      const findBestAvailableLanguage =
        RNLocalize.findBestAvailableLanguage(LANG_CODES);
      availableLanguage = findBestAvailableLanguage?.languageTag || 'en';
      callback(availableLanguage);
    } else {
      callback(availableLanguage!);
    }
    return availableLanguage!;
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    await setUserLanguage(language);
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: LANGUAGES,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
  });
