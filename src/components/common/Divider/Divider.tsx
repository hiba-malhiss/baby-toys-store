import React from 'react';
import clsx from 'clsx';
import styles from './divider.module.scss';

interface DividerProps {
  className?: string;
  thickness?: string;
}

export const Divider: React.FC<DividerProps> = ({ className, thickness = '1px', fullWidth }) => {
  return (
    <hr
      className={clsx(styles.divider, className, fullWidth && styles.fullWidth)}
      style={{ borderTopWidth: thickness }}
    />
  );
};
