import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import DashboardStats from './DashboardStats/DashboardStats.tsx';
import DashboardLists from './DashboardLists/DashboardLists.tsx';
import styles from './dashboard-page.module.scss';
import DashboardCharts from './DashboardCharts/ DashboardCharts.tsx';
import { Heading, BouncingDotsLoader } from '@baby-toys/ui-kit/components';
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

  return (
    <AdminLayout>
      <Heading className="bts-marginBm">Dashboard</Heading>
      <Heading level="h4" appearance="light" className="bts-marginBxxl">
        Welcome back, Admin!
      </Heading>
      {isLoading && <BouncingDotsLoader className="bts-marginTxxl" />}
      {!isLoading && (
        <>
          <DashboardStats stats={stats} />
          <DashboardCharts
            salesData={stats?.salesData || []}
            categoryDistribution={categoryDistribution}
            orderStatusData={orderStatusData}
          />
          <DashboardLists lowStock={lowStock} topSelling={topSelling} recentOrders={recentOrders} />
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardPage;
