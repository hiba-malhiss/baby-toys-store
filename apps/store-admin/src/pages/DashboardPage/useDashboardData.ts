import { useState, useEffect } from 'react';
import { apiClient } from '../../api/apiClient';
import {
  getDashboardStats,
  getLowStockProducts,
  getTopSellingProducts,
  getRecentOrders,
  getOrderStatusBreakdown,
  getCategoryDistribution,
} from '@mock-data/useMockAdminApi';

export const useDashboardData = () => {
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

  return {
    stats,
    lowStock,
    topSelling,
    recentOrders,
    orderStatusData,
    categoryDistribution,
    isLoading,
  };
};
