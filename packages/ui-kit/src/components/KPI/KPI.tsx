import React from 'react';
import styles from './kpi.module.scss';
import clsx from 'clsx';

export interface KPIProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const KPI: React.FC<KPIProps> = ({ fullWidth, label, value, className }) => {
  return (
    <div className={clsx(styles.kpi, className, fullWidth ? styles.fullWidth : '')}>
      <div className={styles.kpiLabel}>{label}</div>
      <div className={styles.kpiValue}>{value}</div>
    </div>
  );
};

export default KPI;
