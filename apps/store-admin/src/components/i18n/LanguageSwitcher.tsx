import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { queryClient } from '../../App';
import { getAppLocale, setAppLocale } from './locale';
import styles from './language-switcher.module.scss';

type Locale = 'en' | 'ar';

function normalizeLocale(raw?: string | null): Locale {
  const v = (raw || '').toLowerCase();
  return v.startsWith('ar') ? 'ar' : 'en';
}

function applyDocumentLang(locale: Locale) {
  if (typeof document === 'undefined') return;

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('lang', locale);
  document.documentElement.setAttribute('dir', dir);
}

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();

  const current = useMemo<Locale>(() => {
    const fromI18n = normalizeLocale(i18n.resolvedLanguage || i18n.language);
    const fromStorage = normalizeLocale(getAppLocale());
    // prefer i18n if set, otherwise fallback to stored
    return fromI18n || fromStorage;
  }, [i18n.language, i18n.resolvedLanguage]);

  const isAr = current === 'ar';

  const toggle = useCallback(async () => {
    const next: Locale = isAr ? 'en' : 'ar';

    setAppLocale(next);
    applyDocumentLang(next);

    await i18n.changeLanguage(next);

    // Refresh queries to pick up new Accept-Language header
    queryClient.invalidateQueries();
  }, [i18n, isAr]);

  return (
    <button
      type="button"
      className={styles.langToggle}
      onClick={toggle}
      aria-label={isAr ? t('language.switchToEnglish') : t('language.switchToArabic')}
      aria-pressed={isAr}
      title={isAr ? t('language.toggleTitleEn') : t('language.toggleTitleAr')}
    >
      <span className={styles.langLabel} data-locale={current} data-dir={isAr ? 'rtl' : 'ltr'}>
        <span className={clsx(styles.langText, isAr && styles.selected)}>AR</span>
        <span className={clsx(styles.langText, !isAr && styles.selected)}>EN</span>
        <span className={styles.knob} />
      </span>
    </button>
  );
};

export default LanguageSwitcher;
