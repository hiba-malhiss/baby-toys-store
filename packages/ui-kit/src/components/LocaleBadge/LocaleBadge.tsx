import React from 'react';
import styles from './locale-badge.module.scss';
import clsx from 'clsx';

type LocaleBadgeProps = {
  locale: string;
  size?: 'small' | 'medium';
  className?: string;
};

const LocaleBadge: React.FC<LocaleBadgeProps> = ({ locale, size = 'small', className }) => {
  return (
    <span className={clsx(styles.localeBadge, styles[`localeBadge--${size}`], className)}>
      {locale.toUpperCase()}
    </span>
  );
};

export default LocaleBadge;
