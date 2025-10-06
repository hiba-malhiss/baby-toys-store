import React, { useState } from 'react';
import clsx from 'clsx';
import { queryClient } from '../../App';
import { getAppLocale, setAppLocale } from './locale';
import styles from './language-switcher.module.scss';

const LanguageSwitcher: React.FC = () => {
  const [current, setCurrent] = useState<string>((getAppLocale() || 'en').toLowerCase());
  const isAr = current.startsWith('ar');

  const handleToggle = () => {
    const next = isAr ? 'en' : 'ar';
    setAppLocale(next);
    setCurrent(next);

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', next);
    }

    // Refresh queries to pick up new Accept-Language header
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
      <span className={styles.langLabel} data-locale={isAr ? 'ar' : 'en'}>
        <span className={clsx(styles.langText, isAr && styles.selected)}>AR</span>
        <span className={clsx(styles.langText, !isAr && styles.selected)}>EN</span>
        <span className={styles.knob} />
      </span>
    </button>
  );
};

export default LanguageSwitcher;
