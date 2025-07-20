import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import DashboardStats from './DashboardStats/DashboardStats.tsx';
import DashboardLists from './DashboardLists/DashboardLists.tsx';
import styles from './dashboard-page.module.scss';
import DashboardCharts from './DashboardCharts/ DashboardCharts.tsx';
import { Heading } from '@baby-toys/ui-kit/components';
import { useDashboardData } from './useDashboardData';

const DashboardPage: React.FC = () => {
  const {
    stats,
    lowStock,
    topSelling,
    recentOrders,
    orderStatusData,
    categoryDistribution,
    isLoading,
  } = useDashboardData();

  if (isLoading) {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <Heading className="bts-marginBm">Dashboard</Heading>
        <Heading level="h4" appearance="light" className="bts-marginBxxl">
          Welcome back, Admin!
        </Heading>

        <DashboardStats stats={stats} />
        <DashboardCharts
          salesData={stats?.salesData || []}
          categoryDistribution={categoryDistribution}
          orderStatusData={orderStatusData}
        />
        <DashboardLists lowStock={lowStock} topSelling={topSelling} recentOrders={recentOrders} />
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
