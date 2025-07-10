import React from 'react';
import { Card } from '@baby-toys/ui-kit/components';
import styles from './dashboard-stats.module.scss';

interface StatsProps {
  stats: {
    totalProducts?: number;
    totalOrders?: number;
    pendingOrders?: number;
    totalRevenue?: number;
    totalCustomers?: number;
  };
}

const DashboardStats: React.FC<StatsProps> = ({ stats }) => (
  <div className={styles.statsGrid}>
    <Card size="small" className={styles.statCard}>
      <div className={styles.value}>{stats.totalProducts ?? '-'}</div>
      <div className={styles.label}>Total Products</div>
    </Card>
    <Card size="small" className={styles.statCard}>
      <div className={styles.value}>{stats.totalOrders ?? '-'}</div>
      <div className={styles.label}>Total Orders</div>
    </Card>
    <Card size="small" className={styles.statCard}>
      <div className={styles.value}>{stats.pendingOrders ?? '-'}</div>
      <div className={styles.label}>Pending Orders</div>
    </Card>
    <Card size="small" className={styles.statCard}>
      <div className={styles.value}>
        {stats.totalRevenue !== undefined ? `$${stats.totalRevenue.toFixed(2)}` : '-'}
      </div>
      <div className={styles.label}>Revenue This Month</div>
    </Card>
    <Card size="small" className={styles.statCard}>
      <div className={styles.value}>{stats.totalCustomers ?? '-'}</div>
      <div className={styles.label}>Total Customers</div>
    </Card>
  </div>
);

export default DashboardStats;
