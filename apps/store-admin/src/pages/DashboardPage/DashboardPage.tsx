import React, { useMemo, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Card, BouncingDotsLoader, KPI, Table, Tooltip, RadioButtonGroup } from '@baby-toys/ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import KPIWithTooltip from '../../components/KPIWithTooltip/KPIWithTooltip';
import { Tooltips } from '../../constants/tooltips';
import { useAdminDashboard } from '../../api/dashboardApi';
import styles from './dashboard-page.module.scss';
import { Line, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Legend,
} from 'chart.js';
import { buildComparisonSubtitle, formatAbbrevMoney, formatMoney } from './dashboard.helpers';
import { useStoreSettings } from '../../api/settingsApi.ts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Legend,
  ChartDataLabels
);

const ChartCard: React.FC<{ title: React.ReactNode; children: React.ReactNode }> = ({ title, children }) => (
  <Card className={styles.chartCard}>
    <div className={styles.chartTitle}>{title}</div>
    <div className={styles.chartBody}>{children}</div>
  </Card>
);

const DashboardPage: React.FC = () => {
  const { data, isLoading } = useAdminDashboard();
  const { data: settings } = useStoreSettings();
  const currency = { symbol: settings?.general?.currencySymbol } as const;

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

  // Sales comparison series from backend
  const currentLabels = data?.salesOverTimeComparison?.labels ?? [];
  const currentSeries = (data?.salesOverTimeComparison?.current as number[]) ?? [];
  const prevSeries = (data?.salesOverTimeComparison?.previous as number[]) ?? [];

  // ------ Helpers for the comparison chart ------
  const {
    currentStart: currentStartLabel,
    currentEnd: currentEndLabel,
    prevStart: prevStartLabel,
    prevEnd: prevEndLabel
  } =
    buildComparisonSubtitle(currentLabels, 30);


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

  // Product Interest state and derived dataset
  const [interestMetric, setInterestMetric] = useState<'views' | 'wishlists' | 'cart'>('views');
  const interest = useMemo(() => {
    const labels = interestMetric === 'views'
      ? (data?.productInterest?.topViewed?.labels ?? [])
      : interestMetric === 'wishlists'
        ? (data?.productInterest?.topWishlisted?.labels ?? [])
        : (data?.productInterest?.topAddedToCart?.labels ?? []);
    const series = interestMetric === 'views'
      ? ((data?.productInterest?.topViewed?.data as number[]) ?? [])
      : interestMetric === 'wishlists'
        ? ((data?.productInterest?.topWishlisted?.data as number[]) ?? [])
        : ((data?.productInterest?.topAddedToCart?.data as number[]) ?? []);
    const label = interestMetric === 'cart' ? 'Add to Cart' : interestMetric.charAt(0).toUpperCase() + interestMetric.slice(1);
    const color = interestMetric === 'views' ? palette.primary : interestMetric === 'wishlists' ? palette.info : palette.success;
    return { labels, series, label, color } as const;
  }, [data, interestMetric]);

  return (
    <AdminLayout>
      <Heading className="bts-marginBm">Dashboard</Heading>
      <Heading level="h4" appearance="light" className="bts-marginBxxl">
        Welcome back, Admin!
      </Heading>

      {isLoading && <BouncingDotsLoader className="bts-marginTxxl"/>}

      {!isLoading && data && (
        <>
          {/* Revenue Health KPI Tiles */}
          <div className={styles.kpiGrid}>
            <KPIWithTooltip
              label="Revenue (This Month)"
              tooltip={Tooltips.dashboard.revenueThisMonth}
              value={`${currency.symbol}${data.revenueThisMonth}`}
            />
            <KPIWithTooltip
              label="MoM Revenue Change"
              tooltip="How much your revenue increased or decreased compared to last month."
              value={`${((data.revenueMoMPercent ?? 0) * 100).toFixed(1)}%`}
            />
            <KPI
              label="Average Order Value"
              value={`${currency.symbol}${data.aovThisMonth}`}
            />
            <KPI label="Pending Orders" value={data.pendingOrders}/>
          </div>

          {/* Charts */}
          <div className={styles.chartsGrid}>
            <ChartCard
              title={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span>Sales Over Time (Current vs Previous)</span>
                  <Tooltip
                    content={
                      <div style={{ maxWidth: 280 }}>
                        Current = last 30 days including today. Previous = the 30 days immediately before. Values are
                        delivered-order revenue per day.
                      </div>
                    }
                    position="top"
                  >
                    <span><FontAwesomeIcon icon={faCircleInfo} style={{ opacity: 0.75, cursor: 'help' }}/></span>
                  </Tooltip>
                </span>
              }
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>
                  <div>Current: {currentStartLabel} → {currentEndLabel}</div>
                  <div>Previous: {prevStartLabel} → {prevEndLabel}</div>
                </div>
              </div>
              <div style={{ height: 300 }}>
                <Line
                  data={{
                    labels: currentLabels,
                    datasets: [
                      {
                        label: 'Current',
                        data: currentSeries,
                        borderColor: palette.primary,
                        backgroundColor: 'rgba(16, 150, 181, 0.15)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0,
                        borderWidth: 2,
                      },
                      {
                        label: 'Previous',
                        data: prevSeries,
                        borderColor: palette.secondary,
                        backgroundColor: 'rgba(127, 127, 127, 0.1)',
                        borderDash: [6, 6] as const,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 0,
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        ticks: {
                          callback: (value: any) => formatAbbrevMoney(Number(value), currency.symbol),
                        },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (ctx: any) => `${ctx.dataset.label}: ${formatMoney(Number(ctx.parsed.y || 0), currency.symbol)}`,
                          title: (items: any[]) => items?.[0]?.label ?? '',
                        },
                      },
                    },
                  }}
                />
              </div>
            </ChartCard>

            <ChartCard title={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>Category Revenue (30 days)</span>
                <Tooltip content="Delivered revenue per category in the last 30 days." position="top">
                  <span><FontAwesomeIcon icon={faCircleInfo} style={{ opacity: 0.75, cursor: 'help' }}/></span>
                </Tooltip>
              </span>
            }>
              <div style={{ height: 300 }}>
                <Bar
                  data={categoryRevenue}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </ChartCard>

            <ChartCard title="Top Selling Products">
              <div style={{ height: 300 }}>
                <Bar
                  data={topSelling}
                  options={{ indexAxis: 'y' as const, responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </ChartCard>

            <ChartCard title={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>Product Interest (Last 30 Days)</span>
                <Tooltip
                  content="Views, Wishlists, and Adds to Cart combined. Switch metric. Expand to view the funnel table."
                  position="top">
                  <span><FontAwesomeIcon icon={faCircleInfo} style={{ opacity: 0.75, cursor: 'help' }}/></span>
                </Tooltip>
              </span>
            }>
              <div>
                <RadioButtonGroup
                  options={[
                    { label: 'Views', value: 'views' },
                    { label: 'Wishlists', value: 'wishlists' },
                    { label: 'Add to Cart', value: 'cart' },
                  ]}
                  selectedValue={interestMetric}
                  name="product-interest"
                  onChange={(val: string) => setInterestMetric(val as 'views' | 'wishlists' | 'cart')}
                  appearance="chip"
                  justify="start"
                />
                <div style={{ height: 280 }}>
                  <Bar
                    data={{
                      labels: interest.labels,
                      datasets: [{
                        label: interest.label,
                        data: interest.series,
                        backgroundColor: interest.color,
                        borderRadius: 4
                      }],
                    }}
                    options={{ indexAxis: 'y' as const, responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </ChartCard>
          </div>
          <Table
            title="Product Conversion Funnel (30 days)"
            columns={[
              { header: 'Product', field: 'name' },
              {
                header: 'View→Wishlist %',
                field: 'viewToWishlistRate',
                body: (r: any) => `${(r.viewToWishlistRate * 100).toFixed(1)}%`
              },
              {
                header: 'Wishlist→Cart %',
                field: 'wishlistToCartRate',
                body: (r: any) => `${(r.wishlistToCartRate * 100).toFixed(1)}%`
              },
              {
                header: 'Cart→Purchase %',
                field: 'cartToPurchaseRate',
                body: (r: any) => `${(r.cartToPurchaseRate * 100).toFixed(1)}%`
              },
            ]}
            data={(data?.productInterest?.funnel ?? []).slice(0, 20)}
          />
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardPage;
