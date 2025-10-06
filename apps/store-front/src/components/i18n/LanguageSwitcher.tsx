import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import styles from './language-switcher.module.scss';
import { queryClient } from '../../App';
import { setAppLocale } from './locale.ts';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const current = (i18n.language || 'en').toLowerCase();
  const isAr = current.startsWith('ar');

  const handleToggle = () => {
    const next = isAr ? 'en' : 'ar';

    i18n.changeLanguage(next);
    setAppLocale(next);

    document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', next);

    // Invalidate cached data to reload translated content
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
