import React, { useMemo, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Card, BouncingDotsLoader, KPI, Table, Tooltip, RadioButtonGroup } from '@baby-toys/ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import KPIWithTooltip from '../../components/KPIWithTooltip/KPIWithTooltip';
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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
          label: t('dashboard.revenueLabel'),
          data: (data?.categoryDistribution?.data as number[]) ?? [],
          backgroundColor: palette.accent,
          borderRadius: 4,
        },
      ],
    }),
    [data, palette.accent, t]
  );

  const topSelling = useMemo(
    () => ({
      labels: data?.topSellingProducts?.labels ?? [],
      datasets: [
        {
          label: t('dashboard.quantityLabel'),
          data: (data?.topSellingProducts?.data as number[]) ?? [],
          backgroundColor: palette.info,
          borderRadius: 4,
        },
      ],
    }),
    [data, palette.info, t]
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
    const label =
      interestMetric === 'cart'
        ? t('dashboard.addToCart')
        : interestMetric === 'views'
          ? t('dashboard.views')
          : t('dashboard.wishlists');
    const color = interestMetric === 'views' ? palette.primary : interestMetric === 'wishlists' ? palette.info : palette.success;
    return { labels, series, label, color } as const;
  }, [data, interestMetric, palette.info, palette.primary, palette.success, t]);

  return (
    <AdminLayout>
      <Heading className="bts-marginBm">{t('dashboard.title')}</Heading>
      <Heading level="h4" appearance="light" className="bts-marginBxxl">
        {t('dashboard.welcome')}
      </Heading>

      {isLoading && <BouncingDotsLoader className="bts-marginTxxl"/>}

      {!isLoading && data && (
        <>
          {/* Revenue Health KPI Tiles */}
          <div className={styles.kpiGrid}>
            <KPIWithTooltip
              label={t('dashboard.revenueThisMonth')}
              tooltip={t('tooltips.dashboard.revenueThisMonth')}
              value={`${currency.symbol}${data.revenueThisMonth}`}
            />
            <KPIWithTooltip
              label={t('dashboard.momRevenueChange')}
              tooltip={t('tooltips.dashboard.momRevenueChange')}
              value={`${((data.revenueMoMPercent ?? 0) * 100).toFixed(1)}%`}
            />
            <KPI
              label={t('dashboard.averageOrderValue')}
              value={`${currency.symbol}${data.aovThisMonth}`}
            />
            <KPI label={t('dashboard.pendingOrders')} value={data.pendingOrders}/>
          </div>

          {/* Charts */}
          <div className={styles.chartsGrid}>
            <ChartCard
              title={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span>{t('dashboard.salesOverTime')}</span>
                  <Tooltip
                    content={
                      <div style={{ maxWidth: 280 }}>
                        {t('tooltips.dashboard.salesOverTime')}
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
                  <div>{t('dashboard.currentRange', { start: currentStartLabel, end: currentEndLabel })}</div>
                  <div>{t('dashboard.previousRange', { start: prevStartLabel, end: prevEndLabel })}</div>
                </div>
              </div>
              <div style={{ height: 300 }}>
                <Line
                  data={{
                    labels: currentLabels,
                    datasets: [
                      {
                        label: t('dashboard.currentLabel'),
                        data: currentSeries,
                        borderColor: palette.primary,
                        backgroundColor: 'rgba(16, 150, 181, 0.15)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0,
                        borderWidth: 2,
                      },
                      {
                        label: t('dashboard.previousLabel'),
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
                <span>{t('dashboard.categoryRevenue30d')}</span>
                <Tooltip content={t('tooltips.dashboard.categoryRevenue30d')} position="top">
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

            <ChartCard title={t('dashboard.topSelling')}>
              <div style={{ height: 300 }}>
                <Bar
                  data={topSelling}
                  options={{ indexAxis: 'y' as const, responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </ChartCard>

            <ChartCard title={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>{t('dashboard.productInterest')}</span>
                <Tooltip
                  content={t('tooltips.dashboard.productInterest')}
                  position="top">
                  <span><FontAwesomeIcon icon={faCircleInfo} style={{ opacity: 0.75, cursor: 'help' }}/></span>
                </Tooltip>
              </span>
            }>
              <div>
                <RadioButtonGroup
                  options={[
                    { label: t('dashboard.views'), value: 'views' },
                    { label: t('dashboard.wishlists'), value: 'wishlists' },
                    { label: t('dashboard.addToCart'), value: 'cart' },
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
            title={t('dashboard.productConversionFunnel')}
            columns={[
              { header: t('dashboard.table.product'), field: 'name' },
              {
                header: t('dashboard.table.viewToWishlist'),
                field: 'viewToWishlistRate',
                body: (r: any) => `${(r.viewToWishlistRate * 100).toFixed(1)}%`
              },
              {
                header: t('dashboard.table.wishlistToCart'),
                field: 'wishlistToCartRate',
                body: (r: any) => `${(r.wishlistToCartRate * 100).toFixed(1)}%`
              },
              {
                header: t('dashboard.table.cartToPurchase'),
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
