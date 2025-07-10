import React from 'react';
import { Card } from '@baby-toys/ui-kit/components';
import { Line, Pie, Doughnut } from 'react-chartjs-2';
import styles from './dashboard-charts.module.scss';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryDistributionItem {
  category: string;
  salesCount: number;
  percentage: number;
}

interface DashboardChartsProps {
  salesData: { date: string; sales: number }[];
  categoryDistribution: CategoryDistributionItem[];
  orderStatusData: Record<string, number>;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  salesData,
  categoryDistribution,
  orderStatusData,
}) => {
  const lineChartData = {
    labels: salesData?.map((d) => d.date) || [],
    datasets: [
      {
        label: 'Sales',
        data: salesData?.map((d) => d.sales) || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: categoryDistribution.map((c) => c.category),
    datasets: [
      {
        label: 'Category Distribution',
        data: categoryDistribution.map((c) => c.salesCount),
        backgroundColor: [
          '#f87171',
          '#60a5fa',
          '#fbbf24',
          '#34d399',
          '#a78bfa',
          '#fb923c',
          '#8b5cf6',
        ],
        borderWidth: 1,
      },
    ],
  };

  const orderStatusChartData = {
    labels: Object.keys(orderStatusData),
    datasets: [
      {
        data: Object.values(orderStatusData),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#9CA3AF'],
      },
    ],
  };

  return (
    <div className={styles.chartsGrid}>
      {salesData?.length > 0 && (
        <Card size="medium" className={styles.chartCard} header="Sales Over Time">
          <Line data={lineChartData} />
        </Card>
      )}
      {categoryDistribution.length > 0 && (
        <Card size="medium" className={styles.chartCard} header="Category Distribution">
          <Pie data={pieChartData} />
        </Card>
      )}
      {Object.keys(orderStatusData).length > 0 && (
        <Card size="medium" className={styles.chartCard} header="Order Status Breakdown">
          <Doughnut data={orderStatusChartData} />
        </Card>
      )}
    </div>
  );
};

export default DashboardCharts;
