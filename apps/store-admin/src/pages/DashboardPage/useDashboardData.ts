import { useState, useEffect } from 'react';
import { apiClient } from '../../api/apiClient';
import { useMockAdminApi } from '@mock-data/useMockApi';
import {
  AdminDashboardStats,
  CategoryDistributionItem,
  OrderItem,
  Product,
} from '@baby-toys/types/src';

export const useDashboardData = () => {
  const {
    getDashboardStats,
    getLowStockProducts,
    getTopSellingProducts,
    getRecentOrders,
    getOrderStatusBreakdown,
    getCategoryDistribution,
  } = useMockAdminApi();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [topSelling, setTopSelling] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<Record<string, number>>({});
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistributionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dataLoaders = [
      { api: getDashboardStats, setter: setStats },
      { api: getLowStockProducts, setter: setLowStock },
      { api: getTopSellingProducts, setter: setTopSelling },
      { api: getRecentOrders, setter: setRecentOrders },
      { api: getOrderStatusBreakdown, setter: setOrderStatusData },
      {
        api: async () => {
          try {
            const response = await getCategoryDistribution();
            return response?.categoryDistributions || [];
          } catch (error) {
            console.error('Error fetching category distribution:', error);
            return [];
          }
        },
        setter: (data: CategoryDistributionItem[]) => {
          setCategoryDistribution(Array.isArray(data) ? data : []);
        },
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
  }, [
    getDashboardStats,
    getLowStockProducts,
    getTopSellingProducts,
    getRecentOrders,
    getOrderStatusBreakdown,
    getCategoryDistribution,
  ]);

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
