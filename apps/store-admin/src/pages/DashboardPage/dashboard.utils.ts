import { ChartData } from 'chart.js';
import { CategoryDistributionItem } from '@baby-toys/types/src';

interface SalesData {
  date: string;
  sales: number;
}

type OrderStatusData = Record<string, number>;

export const generateLineChartData = (salesData: SalesData[]): ChartData<'line'> => ({
  labels: salesData?.map((d) => d.date) || [],
  datasets: [
    {
      label: 'Sales',
      data: salesData?.map((d) => d.sales) || [],
      borderColor: '#1096b5',
      backgroundColor: '#0a6487',
      tension: 0.4,
    },
  ],
});

export const generatePieChartData = (
  categoryDistribution: CategoryDistributionItem[]
): ChartData<'pie'> => ({
  labels: categoryDistribution.map((c) => c.category),
  datasets: [
    {
      label: 'Category Distribution',
      data: categoryDistribution.map((c) => c.salesCount),
      backgroundColor: ['#1096b5', '#f26c62', '#1fa309', '#e5a504', '#fb923c'],
      borderWidth: 1,
    },
  ],
});

export const generateOrderStatusChartData = (
  orderStatusData: OrderStatusData
): ChartData<'doughnut'> => ({
  labels: Object.keys(orderStatusData),
  datasets: [
    {
      data: Object.values(orderStatusData),
      backgroundColor: ['#1096b5', '#f26c62', '#1fa309', '#e5a504', '#fb923c'],
    },
  ],
});
