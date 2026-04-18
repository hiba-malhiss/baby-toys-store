import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import styles from './language-switcher.module.scss';
import { queryClient } from './../App';
import { setAppLocale } from './locale.ts';
import { useTranslationSetting } from '../hooks/useTranslationSetting';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const translationEnabled = useTranslationSetting();
  const current = (i18n.language || 'en').toLowerCase();
  const isAr = current.startsWith('ar');

  // Hide the switcher when only one language is active
  if (!translationEnabled) return null;

  const handleToggle = () => {
    const next = isAr ? 'en' : 'ar';
    i18n.changeLanguage(next);
    setAppLocale(next);
    document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', next);
    queryClient.invalidateQueries();
  };

  return (
    <button
      type="button"
      className={styles.langToggle}
      onClick={handleToggle}
      aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
      aria-pressed={isAr}
      title={isAr ? 'EN' : 'AR'}
    >
      <span className={styles.langLabel}>
        <span className={clsx(styles.langText, isAr && styles.selected)}>AR</span>
        <span className={clsx(styles.langText, !isAr && styles.selected)}>EN</span>
        <span className={styles.knob} />
      </span>
    </button>
  );
};

export default LanguageSwitcher;
