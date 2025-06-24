import React from 'react';
import clsx from 'clsx';
import styles from './divider.module.scss';

interface DividerProps {
  className?: string;
  thickness?: string;
}

export const Divider: React.FC<DividerProps> = ({ className, thickness = '1px' }) => {
  return <hr className={clsx(styles.divider, className)} style={{ borderTopWidth: thickness }} />;
};
