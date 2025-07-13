/* eslint-disable @typescript-eslint/no-floating-promises */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esTranslation from '../public/locales/es/translation.json';
import enTranslation from '../public/locales/en/translation.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    lng: 'es', // default language
    resources: {
      es: {
        translation: esTranslation
      },
      en: {
        translation: enTranslation
      }
    },
    interpolation: {
      escapeValue: false, // React already safeguards from XSS
    },
  });

export default i18n;
