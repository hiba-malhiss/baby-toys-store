import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './language-switcher.module.scss';
import clsx from 'clsx';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const current = (i18n.language || 'en').toLowerCase();
  const isAr = useMemo(() => current.startsWith('ar'), [current]);

  const handleToggle = () => {
    const next = isAr ? 'en' : 'ar';
    i18n.changeLanguage(next);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', next);
    }
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
