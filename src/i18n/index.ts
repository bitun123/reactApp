import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';

const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
  bn: {
    translation: bn,
  },
};

const deviceLanguage =
  RNLocalize.getLocales()[0]?.languageCode || 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;