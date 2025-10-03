import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '../locales/en/common.json';
import arCommon from '../locales/ar/common.json';

const resources = {
  en: { common: enCommon },
  ar: { common: arCommon },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    defaultNS: 'common',
    ns: ['common'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'querystring', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

// Handle RTL for Arabic
const applyDir = (lng?: string) => {
  const dir = lng && lng.startsWith('ar') ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lng || 'en');
};

applyDir(i18n.language);
i18n.on('languageChanged', applyDir);

export default i18n;
