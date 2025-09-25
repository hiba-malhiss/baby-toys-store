import React, { useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Card, BouncingDotsLoader, KPI } from '@baby-toys/ui-kit';
import { useAdminDashboard } from '../../api/dashboardApi';
import styles from './dashboard-page.module.scss';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  Tooltip,
  Legend
);
import currency from '../../config/currency';

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card className={styles.chartCard}>
    <div className={styles.chartTitle}>{title}</div>
    <div className={styles.chartBody}>{children}</div>
  </Card>
);

const DashboardPage: React.FC = () => {
  const { data, isLoading } = useAdminDashboard();

  // Using your theme colors
  const palette = {
    primary: '#1096b5',
    primaryDark: '#0f83b2',
    accent: '#f26c62',
    secondary: '#7f7f7f',
    success: '#25bf0c',
    warning: '#feb705',
    info: '#12aee0',
    danger: '#e74c3c',
    light: '#f8f9fa',
  };

  const salesOverTime = useMemo(
    () => ({
      labels: data?.salesOverTime?.labels ?? [],
      datasets: [
        {
          label: 'Revenue',
          data: (data?.salesOverTime?.data as number[]) ?? [],
          borderColor: palette.primary,
          backgroundColor: 'rgba(16, 150, 181, 0.15)',
          fill: true,
          tension: 0.3,
        },
      ],
    }),
    [data]
  );

  const categoryRevenue = useMemo(
    () => ({
      labels: data?.categoryDistribution?.labels ?? [],
      datasets: [
        {
          label: 'Revenue',
          data: (data?.categoryDistribution?.data as number[]) ?? [],
          backgroundColor: palette.accent,
          borderRadius: 4,
        },
      ],
    }),
    [data]
  );

  const statusBreakdown = useMemo(() => {
    const labels = data?.orderStatusBreakdown?.labels ?? [];
    const series = (data?.orderStatusBreakdown?.data as number[]) ?? [];
    const colors = [
      palette.primary,
      palette.success,
      palette.warning,
      palette.danger,
      palette.info,
      palette.accent,
    ];
    return {
      labels,
      datasets: [
        {
          data: series,
          backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        },
      ],
    };
  }, [data]);

  const topSelling = useMemo(
    () => ({
      labels: data?.topSellingProducts?.labels ?? [],
      datasets: [
        {
          label: 'Qty',
          data: (data?.topSellingProducts?.data as number[]) ?? [],
          backgroundColor: palette.info,
          borderRadius: 4,
        },
      ],
    }),
    [data]
  );

  return (
    <AdminLayout>
      <Heading className="bts-marginBm">Dashboard</Heading>
      <Heading level="h4" appearance="light" className="bts-marginBxxl">
        Welcome back, Admin!
      </Heading>

      {isLoading && <BouncingDotsLoader className="bts-marginTxxl" />}

      {!isLoading && data && (
        <>
          {/* KPI Tiles */}
          <div className={styles.kpiGrid}>
            <KPI label="Total Products" value={data.totalProducts} />
            <KPI label="Total Orders" value={data.totalOrders} />
            <KPI label="Pending Orders" value={data.pendingOrders} />
            <KPI label="Revenue (This Month)" value={`${currency.symbol}${data.revenueThisMonth}`} />
            <KPI label="Total Customers" value={data.totalCustomers} />
          </div>

          {/* Charts */}
          <div className={styles.chartsGrid}>
            <ChartCard title="Sales Over Time (Last 30 days)">
              <Line
                data={salesOverTime}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </ChartCard>

            <ChartCard title="Category Revenue (30 days)">
              <Bar
                data={categoryRevenue}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </ChartCard>

            <ChartCard title="Order Status Breakdown">
              <Doughnut
                data={statusBreakdown}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </ChartCard>

            <ChartCard title="Top Selling Products">
              <Bar
                data={topSelling}
                options={{ indexAxis: 'y' as const, responsive: true, maintainAspectRatio: false }}
              />
            </ChartCard>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardPage;
