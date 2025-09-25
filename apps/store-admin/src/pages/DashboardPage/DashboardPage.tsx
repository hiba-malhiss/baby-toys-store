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

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card className={styles.chartCard}>
    <div className={styles.chartTitle}>{title}</div>
    <div className={styles.chartBody}>{children}</div>
  </Card>
);

const DashboardPage: React.FC = () => {
  const { data, isLoading } = useAdminDashboard();

  const salesOverTime = useMemo(
    () => ({
      labels: data?.salesOverTime?.labels ?? [],
      datasets: [
        {
          label: 'Revenue',
          data: (data?.salesOverTime?.data as number[]) ?? [],
          borderColor: '#7f56d9',
          backgroundColor: 'rgba(127, 86, 217, 0.2)',
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
          backgroundColor: '#12B76A',
        },
      ],
    }),
    [data]
  );

  const statusBreakdown = useMemo(() => {
    const labels = data?.orderStatusBreakdown?.labels ?? [];
    const series = (data?.orderStatusBreakdown?.data as number[]) ?? [];
    const colors = ['#7f56d9', '#12B76A', '#F79009', '#F04438', '#175CD3', '#6E59A5'];
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
          backgroundColor: '#175CD3',
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
          {/* Tiles */}
          <div className={styles.kpiGrid}>
            <KPI label="Total Products" value={data.totalProducts} />
            <KPI label="Total Orders" value={data.totalOrders} />
            <KPI label="Pending Orders" value={data.pendingOrders} />
            <KPI label="Revenue (This Month)" value={`$${data.revenueThisMonth}`} />
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
