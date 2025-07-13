import React from 'react';
import { Card } from '@baby-toys/ui-kit/components';
import styles from './dashboard-stats.module.scss';
import { formatNumber } from '@baby-toys/ui-kit/utils';
import { useAdminStoreConfiguration } from '../../../context/StoreConfigurationContext.tsx';

interface StatsProps {
  stats: {
    totalProducts?: number;
    totalOrders?: number;
    pendingOrders?: number;
    totalRevenue?: number;
    totalCustomers?: number;
  };
}

const statItems = [
  { label: 'Total Products', key: 'totalProducts' },
  { label: 'Total Orders', key: 'totalOrders' },
  { label: 'Pending Orders', key: 'pendingOrders' },
  { label: 'Revenue This Month', key: 'totalRevenue', format: 'currency' },
  { label: 'Total Customers', key: 'totalCustomers' },
];

const DashboardStats: React.FC<StatsProps> = ({ stats }) => {
  const { currency } = useAdminStoreConfiguration();

  return (
    <div className={styles.statsGrid}>
      {statItems.map(({ label, key, format }) => {
        const value = stats[key as keyof typeof stats];

        const displayValue =
          value === undefined
            ? '-'
            : format === 'currency'
              ? formatNumber(value, currency?.currency)
              : formatNumber(value);

        return (
          <Card key={key} size="small" className={styles.statCard}>
            <div className={styles.value}>{displayValue}</div>
            <div className={styles.label}>{label}</div>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
