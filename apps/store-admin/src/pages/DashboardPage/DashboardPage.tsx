import React, { useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, BouncingDotsLoader, Table, Button, Flex, Alert } from '@baby-toys/ui-kit';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { faTriangleExclamation, faCircleInfo, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import { useAdminDashboard, DASHBOARD_QUERY_KEY } from '../../api/dashboardApi';
import { useStoreSettings } from '../../api/settingsApi';

import FunnelBars from './FunnelBars';
import DashboardStatCard from './DashboardStatCard/DashboardStatCard';

import styles from './dashboard-page.module.scss';

const clampPct = (pct: number) => Math.max(0, Math.min(100, pct));

function useFormatters(currencyCode: string, locale: string){
  const currencyFmt = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 2,
      }),
    [locale, currencyCode]
  );

  const numFmt = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const money = (v: any) => currencyFmt.format(Number(v ?? 0));
  const num = (v: any) => numFmt.format(Number(v ?? 0));
  const pctFromBps = (bps?: number | null) => (bps == null ? '—' : `${(bps / 100).toFixed(2)}%`);
  const safe = (value: any, fallback: string | number = '—') =>
    value == null || (typeof value === 'number' && Number.isNaN(value)) ? fallback : value;

  return { money, num, pctFromBps, safe };
}

function getAlertAppearance(severity?: string){
  if(severity === 'CRITICAL') return 'error';
  if(severity === 'WARN') return 'warning';
  return 'info';
}

function getAlertIcon(severity?: string){
  return severity === 'CRITICAL' ? faTriangleExclamation : faCircleInfo;
}

export default function DashboardPage(){
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useAdminDashboard();
  const { data: settings } = useStoreSettings();

  const currencyCode = settings?.general?.currency || 'USD';
  const { money, num, pctFromBps, safe } = useFormatters(currencyCode, i18n.language);

  const refresh = () => queryClient.invalidateQueries({ queryKey: [DASHBOARD_QUERY_KEY] });

  const topAlerts = useMemo(() => {
    const urgentCount = data?.alerts?.urgentCount ?? 0;
    const preview = (data?.alerts?.preview ?? []).slice(0, 2);

    if(!urgentCount) {
      return [
        {
          key: 'no-urgent',
          appearance: 'success' as const,
          icon: faCircleCheck,
          title: t('dashboard.alerts.noUrgentTitle', { defaultValue: 'All good' }),
          message: t('dashboard.alerts.noUrgentMsg', { defaultValue: 'No urgent alerts right now.' }),
        },
      ];
    }

    return preview.map((a: any) => ({
      key: String(a.code ?? Math.random()),
      appearance: getAlertAppearance(a.severity),
      icon: getAlertIcon(a.severity),
      title: t('dashboard.alerts.codeTitle', { defaultValue: 'Alert #{{code}}', code: a.code }),
      message: a.message ?? '—',
    }));
  }, [data, t]);

  const funnelItems = useMemo(() => {
    const funnel = (data as any)?.productInterest?.funnel?.[0];

    const empty = [
      { label: t('dashboard.table.viewToWishlist', { defaultValue: 'View→Wishlist %' }), value: 0 },
      { label: t('dashboard.table.wishlistToCart', { defaultValue: 'Wishlist→Cart %' }), value: 0 },
      { label: t('dashboard.table.cartToPurchase', { defaultValue: 'Cart→Purchase %' }), value: 0 },
    ];

    if(!funnel) return empty;

    return [
      { label: empty[0].label, value: Number(funnel.viewToWishlistRate ?? 0) * 100 },
      { label: empty[1].label, value: Number(funnel.wishlistToCartRate ?? 0) * 100 },
      { label: empty[2].label, value: Number(funnel.cartToPurchaseRate ?? 0) * 100 },
    ];
  }, [data, t]);

  const metricsRows = useMemo(() => {
    if(!data) return [];

    return [
      {
        name: t('dashboard.pendingOrders', { defaultValue: 'Pending Orders' }),
        value: num(data.kpis?.pendingOrders),
        change: '—',
        notes: ''
      },
      {
        name: t('dashboard.averageOrderValue', { defaultValue: 'Average Order Value' }),
        value: money(data.kpis?.aovThisMonth),
        change: '—',
        notes: t('dashboard.metrics.mtd', { defaultValue: 'MTD' })
      },

      {
        name: t('dashboard.metrics.salesToday', { defaultValue: 'Sales Today' }),
        value: money(data.today?.salesAmount),
        change: pctFromBps(data.today?.salesChangeVsYesterdayBps),
        notes: '',
      },
      {
        name: t('dashboard.metrics.orderIntakeValue', { defaultValue: 'Order Intake Value' }),
        value: money(data.today?.orderIntakeValue),
        change: pctFromBps(data.today?.orderIntakeValueChangeBps),
        notes: t('dashboard.metrics.orderIntakeNote', { defaultValue: 'New orders value today' }),
      },

      {
        name: t('dashboard.metrics.avgRatingToday', { defaultValue: 'Avg Rating (Today)' }),
        value: `${safe(data.ratings?.avgToday, '—')} / 5`,
        change: t('dashboard.metrics.ratingsCount', {
          defaultValue: '{{count}} ratings',
          count: num(data.ratings?.countToday)
        }),
        notes: '',
      },
      {
        name: t('dashboard.metrics.lateStuckOrders', { defaultValue: 'Late/Stuck Orders' }),
        value: `${num(data.lateStuckOrders?.count)}${data.lateStuckOrders?.amount ? ` • ${money(data.lateStuckOrders?.amount)}` : ''}`,
        change: '—',
        notes: data.lateStuckOrders?.thresholdDays ? t('dashboard.metrics.thresholdDays', {
          defaultValue: '{{days}}d+',
          days: data.lateStuckOrders.thresholdDays
        }) : '',
      },
      {
        name: t('dashboard.metrics.peakHour', { defaultValue: 'Peak Hour' }),
        value: `${safe(data.peakHour?.hourLabel, '—')}${data.peakHour?.amountToday ? ` • ${money(data.peakHour?.amountToday)}` : ''}`,
        change: '—',
        notes: '',
      },
      {
        name: t('dashboard.metrics.topTown', { defaultValue: 'Top Town' }),
        value: `${safe(data.topTown?.name, '—')}${data.topTown?.ordersToday ? ` • ${num(data.topTown?.ordersToday)} ${t('dashboard.metrics.orders', { defaultValue: 'orders' })}` : ''}`,
        change: '—',
        notes: '',
      },
    ];
  }, [data, t, num, money, pctFromBps, safe]);

  return (
    <AdminLayout>
      <div className={styles.page}>
        <Flex justify="between" align="center" className="bts-marginBm">
          <div>
            <Heading className="bts-marginBxs">{t('dashboard.title', { defaultValue: 'Dashboard' })}</Heading>
            <Heading level="h4" appearance="light">
              {t('dashboard.welcome', { defaultValue: 'Welcome back, Admin!' })}
            </Heading>
          </div>

          <Button
            onClick={refresh}
            className="bts-button bts-buttonSecondary"
            disabled={isFetching}
            isLoading={isFetching}
          >
            {t('common.refresh', { defaultValue: 'Refresh' })}
          </Button>
        </Flex>

        {isLoading && <BouncingDotsLoader className="bts-marginTxxl"/>}

        {!isLoading && data && (
          <>
            <div className={styles.alertsTop}>
              {topAlerts.map((a) => (
                <Alert
                  key={a.key}
                  appearance={a.appearance}
                  size="medium"
                  icon={a.icon}
                  title={a.title}
                  message={a.message}
                />
              ))}
            </div>

            <div className={styles.gridTwoCol}>
              {/* LEFT */}
              <div className={styles.stack}>
                <div className={styles.pastelGrid}>
                  <DashboardStatCard
                    tone="pink"
                    title={t('dashboard.revenueThisMonth', { defaultValue: 'Revenue (MTD)' })}
                    tooltip={t('tooltips.dashboard.revenueThisMonth', { defaultValue: 'Revenue for current month' })}
                    value={money(data.kpis?.revenueThisMonth)}
                    subValue={`${t('dashboard.momRevenueChange', { defaultValue: 'MoM' })}: ${pctFromBps(data.kpis?.revenueMoMChangeBps)}`}
                  />

                  <DashboardStatCard
                    tone="yellow"
                    title={t('dashboard.todayOrders', { defaultValue: 'Orders (Today)' })}
                    tooltip={t('tooltips.dashboard.ordersToday', { defaultValue: 'Orders created today' })}
                    value={num(data.today?.ordersCount)}
                    subValue={`${t('dashboard.vsYesterday', { defaultValue: 'vs yesterday' })}: ${pctFromBps(data.today?.ordersChangeVsYesterdayBps)}`}
                  />

                  <DashboardStatCard
                    tone="green"
                    title={t('dashboard.deliveredToday', { defaultValue: 'Delivered (Today)' })}
                    tooltip={t('tooltips.dashboard.deliveredToday', { defaultValue: 'Orders delivered today' })}
                    value={num(data.today?.deliveredOrdersCount)}
                    subValue={`${t('dashboard.vsYesterday', { defaultValue: 'vs yesterday' })}: ${pctFromBps(data.today?.deliveredOrdersChangeBps)}`}
                  />

                  <DashboardStatCard
                    tone="purple"
                    title={t('dashboard.newCustomersToday', { defaultValue: 'New customers (Today)' })}
                    tooltip={t('tooltips.dashboard.newCustomersToday', { defaultValue: 'New customers acquired today' })}
                    value={num(data.customers?.newToday ?? data.today?.newCustomersCount)}
                  />
                </div>

                <div className={styles.sectionBlock}>
                  <Table
                    title={t('dashboard.topProducts.todayTitle', { defaultValue: 'Top Products (Today)' })}
                    columns={[
                      { header: t('dashboard.table.product', { defaultValue: 'Product' }), field: 'name' },
                      {
                        header: t('dashboard.table.soldQty', { defaultValue: 'Sold Quantity' }),
                        field: 'soldQuantity'
                      },
                      {
                        header: t('dashboard.table.revenue', { defaultValue: 'Revenue' }),
                        field: 'amount',
                        body: (r: any) => money(r.amount)
                      },
                    ]}
                    data={(data.topProducts?.items ?? []).slice(0, 10)}
                  />
                </div>

                <div className={styles.sectionBlock}>
                  <Table
                    title={t('dashboard.metrics.title', { defaultValue: 'Metrics' })}
                    columns={[
                      { header: t('dashboard.metrics.metric', { defaultValue: 'Metric' }), field: 'name' },
                      { header: t('dashboard.metrics.value', { defaultValue: 'Value' }), field: 'value' },
                      { header: t('dashboard.metrics.change', { defaultValue: 'Change' }), field: 'change' },
                      { header: t('dashboard.metrics.notes', { defaultValue: 'Notes' }), field: 'notes' },
                    ]}
                    data={metricsRows}
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div className={styles.rightCol}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <Heading level="h3" className={styles.sectionTitle}>
                      {t('dashboard.goals.title', { defaultValue: 'Goals' })}
                    </Heading>
                  </div>

                  <div className={styles.stack}>
                    {/* Daily */}
                    <div>
                      <div className="bts-flex bts-justifyBetween bts-alignCenter bts-marginBxs">
                        <strong>{t('dashboard.goals.dailyOrders', { defaultValue: 'Daily Orders Goal' })}</strong>
                        <span className={styles.textWeak}>{pctFromBps(data.today?.ordersGoalProgressBps)}</span>
                      </div>

                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${clampPct(Number((data.today?.ordersGoalProgressBps ?? 0) / 100))}%` }}
                        />
                      </div>

                      <div className={`bts-marginTs ${styles.textWeak}`}>
                        {data.today?.ordersGoalProgressBps == null
                          ? t('dashboard.goals.noGoal', { defaultValue: 'No goal configured' })
                          : t('dashboard.goals.progress', {
                            defaultValue: '{{current}} / {{goal}}',
                            current: num(data.today?.ordersCount),
                            goal: t('dashboard.goals.goal', { defaultValue: 'goal' }),
                          })}
                      </div>
                    </div>

                    {/* Monthly */}
                    <div>
                      <div className="bts-flex bts-justifyBetween bts-alignCenter bts-marginBxs">
                        <strong>{t('dashboard.goals.monthlyRevenue', { defaultValue: 'Monthly Revenue Goal' })}</strong>
                        <span className={styles.textWeak}>{pctFromBps(data.monthly?.progressBps)}</span>
                      </div>

                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${clampPct(Number((data.monthly?.progressBps ?? 0) / 100))}%` }}
                        />
                      </div>

                      <div className={`bts-marginTs ${styles.textWeak}`}>
                        {data.monthly?.goal == null
                          ? t('dashboard.goals.monthlyNoGoal', {
                            defaultValue: '{{sales}} / —',
                            sales: money(data.monthly?.salesToDate)
                          })
                          : t('dashboard.goals.monthlyProgress', {
                            defaultValue: '{{sales}} / {{goal}}',
                            sales: money(data.monthly?.salesToDate),
                            goal: money(data.monthly?.goal),
                          })}
                        <span className="bts-marginLs">
                          {t('dashboard.goals.remainingDays', { defaultValue: 'Remaining days:' })} {num(data.monthly?.remainingDaysInMonth)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <Heading level="h3" className={styles.sectionTitle}>
                      {t('dashboard.productConversionFunnel', { defaultValue: 'Product Conversion Funnel' })}
                    </Heading>
                  </div>

                  <FunnelBars items={funnelItems}/>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
