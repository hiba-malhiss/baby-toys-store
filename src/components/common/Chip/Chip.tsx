import React from 'react';
import styles from './chip.module.scss';
import clsx from 'clsx';

type ChipProps = {
  label: string;
  appearance?: 'primary';
  className?: string;
};

const appearanceClassMap: Record<string, string> = {
  primary: styles.chipPrimary,
};

const Chip: React.FC<ChipProps> = ({ label, appearance = 'primary', className }) => {
  return (
    <span className={clsx(styles.chip, appearanceClassMap[appearance], className)}>{label}</span>
  );
};

export default Chip;
