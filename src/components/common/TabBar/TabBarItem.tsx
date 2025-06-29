import React from 'react';
import styles from './tab-bar-item.module.scss';

type TabBarItemProps = {
  value: string;
  children: React.ReactNode;
};

export const TabBarItem = ({ value, children }: TabBarItemProps) => {
  return (
    <div data-value={value} className={styles.tabBarItem}>
      {children}
    </div>
  );
};