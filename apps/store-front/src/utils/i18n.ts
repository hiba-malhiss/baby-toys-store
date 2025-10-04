// apps/store-front/src/utils/i18n.ts
import { useTranslation } from 'react-i18next';

// Basic RTL language set as a fallback when i18n.dir is unavailable
const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur']);

export const isRtlLang = (lng?: string): boolean => {
  if (lng) {
    const base = lng.split('-')[0].toLowerCase();
    return RTL_LANGS.has(base);
  }
  if (typeof document !== 'undefined') {
    return document.documentElement.dir === 'rtl';
  }
  return false;
};

export const i18nDir = (lng?: string): 'rtl' | 'ltr' => (isRtlLang(lng) ? 'rtl' : 'ltr');

export const useIsRtl = (): boolean => {
  const { i18n } = useTranslation();
  const dir = typeof i18n.dir === 'function' ? i18n.dir(i18n.language) : i18nDir(i18n.language);
  return dir === 'rtl';
};
