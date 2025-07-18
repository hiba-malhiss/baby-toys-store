import React from 'react';
import { Card } from '@baby-toys/ui-kit/components';
import { Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  generateLineChartData,
  generatePieChartData,
  generateOrderStatusChartData,
} from '../dashboard.utils';
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
import { CategoryDistributionItem } from '@baby-toys/types/src';

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
  const lineChartData = generateLineChartData(salesData);
  const pieChartData = generatePieChartData(categoryDistribution);
  const orderStatusChartData = generateOrderStatusChartData(orderStatusData);

  return (
    <div className={styles.dashboardCharts}>
      {salesData?.length > 0 && (
        <Card size="medium" header="Sales Over Time">
          <Line data={lineChartData} />
        </Card>
      )}
      {categoryDistribution.length > 0 && (
        <Card size="medium" header="Category Distribution">
          <Pie data={pieChartData} />
        </Card>
      )}
      {Object.keys(orderStatusData).length > 0 && (
        <Card size="medium" header="Order Status Breakdown">
          <Doughnut data={orderStatusChartData} />
        </Card>
      )}
    </div>
  );
};

export default DashboardCharts;
