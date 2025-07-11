import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  getDashboardStats,
  getLowStockProducts,
  getTopSellingProducts,
  getRecentOrders,
  getOrderStatusBreakdown,
  getCategoryDistribution,
} from '@mock-data/useMockAdminApi.ts';
import { apiClient } from '../../api/apiClient';

import DashboardStats from './DashboardStats/DashboardStats.tsx';
import DashboardLists from './DashboardLists/DashboardLists.tsx';

import styles from './dashboard-page.module.scss';
import DashboardCharts from './DashboardCharts/ DashboardCharts.tsx';
import { Heading } from '@baby-toys/ui-kit/components';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [topSelling, setTopSelling] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any>(null);
  const [categoryDistribution, setCategoryDistribution] = useState<
    { category: string; salesCount: number; percentage: number }[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dataLoaders = [
      { api: getDashboardStats, setter: setStats },
      { api: getLowStockProducts, setter: setLowStock },
      { api: getTopSellingProducts, setter: setTopSelling },
      { api: getRecentOrders, setter: setRecentOrders },
      { api: getOrderStatusBreakdown, setter: setOrderStatusData },
      {
        api: getCategoryDistribution,
        setter: (data: any) => setCategoryDistribution(data.categoryDistribution),
      },
    ];

    Promise.all(dataLoaders.map(({ api }) => apiClient.get(api)))
      .then((results) => {
        results.forEach((result, index) => {
          dataLoaders[index].setter(result);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <Heading className="bts-marginBxs">Dashboard</Heading>
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
