import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Heading,
  BouncingDotsLoader,
  Table,
  Button,
  Flex,
  Alert,
  ProgressBar,
  Tooltip,
  Icon
} from '@baby-toys/ui-kit';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { faTriangleExclamation, faCircleInfo, faCircleCheck, faSync } from '@fortawesome/free-solid-svg-icons';

import { useAdminDashboard, DASHBOARD_QUERY_KEY } from '../../api/dashboardApi';
import { useStoreSettings } from '../../api/settingsApi';

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
  const navigate = useNavigate();

  const { data, isLoading, isFetching } = useAdminDashboard();
  const { data: settings } = useStoreSettings();

  const currencyCode = settings?.general?.currency || 'USD';
  const { money, num, pctFromBps, safe } = useFormatters(currencyCode, i18n.language);

  const refresh = () => queryClient.invalidateQueries({ queryKey: [DASHBOARD_QUERY_KEY] });

  const topAlerts = useMemo(() => {
    const urgentCount = data?.alerts?.urgentCount ?? 0;
    const preview = (data?.alerts?.preview ?? []).slice(0, 2);

    if(!urgentCount) {
      return [];
    }

    return preview.map((a: any) => ({
      key: String(a.code ?? Math.random()),
      appearance: getAlertAppearance(a.severity),
      icon: getAlertIcon(a.severity),
      title: t('dashboard.alerts.codeTitle', { defaultValue: 'Alert #{{code}}', code: a.code }),
      message: a.message ?? '—',
    }));
  }, [data, t]);

  // productInterest funnel removed (backend doesn't provide it currently)t(

  const metricsRows = useMemo(() => {
    if(!data) return [];

    return [
      {
        name: t('dashboard.pendingOrders', { defaultValue: 'Pending Orders' }),
        value: num(data.kpis?.pendingOrders),
        change: '—',
        notes: '',
        calcInfo: 'Count of orders with status = PENDING'
      },
      {
        name: t('dashboard.averageOrderValue', { defaultValue: 'Average Order Value' }),
        value: money(data.kpis?.aovThisMonth),
        change: '—',
        notes: t('dashboard.metrics.mtd', { defaultValue: 'MTD' }),
        calcInfo: 'Delivered revenue this month / Delivered count this month'
      },
      {
        name: t('dashboard.metrics.revenueLastMonth', { defaultValue: 'Revenue (Last Month)' }),
        value: money(data.kpis?.revenueLastMonth),
        change: '—',
        notes: '',
        calcInfo: 'Sum of totals for orders with status = DELIVERED and deliveredAt in previous month'
      },

      {
        name: t('dashboard.metrics.salesToday', { defaultValue: 'Sales Today' }),
        value: money(data.today?.salesAmount),
        change: pctFromBps(data.today?.salesChangeVsYesterdayBps),
        notes: t('dashboard.metrics.yesterday', {
          defaultValue: 'Yesterday: {{val}}',
          val: money(data.today?.salesYesterdayAmount)
        }),
        calcInfo: 'Sum of totals for orders with status = DELIVERED and deliveredAt in today window'
      },
      {
        name: t('dashboard.metrics.orderIntakeValue', { defaultValue: 'Order Intake Value' }),
        value: money(data.today?.orderIntakeValue),
        change: pctFromBps(data.today?.orderIntakeValueChangeBps),
        notes: `${t('dashboard.metrics.orderIntakeNote', { defaultValue: 'New orders value today' })} • ${t('dashboard.metrics.yesterday', {
          defaultValue: 'Yesterday: {{val}}',
          val: money(data.today?.orderIntakeValueYesterday)
        })}`,
        calcInfo: 'Sum of totals for orders with createdAt in today window (new orders)'
      },

      {
        name: t('dashboard.metrics.avgRatingToday', { defaultValue: 'Avg Rating (Today)' }),
        value: `${safe(data.ratings?.avgToday, '—')} / 5`,
        change: t('dashboard.metrics.ratingsCount', {
          defaultValue: '{{count}} ratings',
          count: num(data.ratings?.countToday)
        }),
        notes: '',
        calcInfo: 'Average of PUBLISHED product reviews created in today window'
      },
      {
        name: t('dashboard.metrics.lateStuckOrders', { defaultValue: 'Late/Stuck Orders' }),
        value: `${num(data.lateStuckOrders?.count)}${data.lateStuckOrders?.amount ? ` • ${money(data.lateStuckOrders?.amount)}` : ''}`,
        change: '—',
        notes: data.lateStuckOrders?.thresholdDays ? t('dashboard.metrics.thresholdDays', {
          defaultValue: '{{days}}d+',
          days: data.lateStuckOrders.thresholdDays
        }) : '',
        calcInfo: 'Count and sum of orders with status = PENDING and createdAt before (todayStart - thresholdDays)'
      },
      {
        name: t('dashboard.metrics.peakHour', { defaultValue: 'Peak Hour' }),
        value: `${safe(data.peakHour?.hourLabel, '—')}${data.peakHour?.amountToday ? ` • ${money(data.peakHour?.amountToday)}` : ''}`,
        change: '—',
        notes: '',
        calcInfo: 'Among delivered orders today, bucket totals by deliveredAt hour; pick hour with max revenue'
      },
      {
        name: t('dashboard.metrics.topTown', { defaultValue: 'Top Town' }),
        value: `${safe(data.topTown?.name, '—')}${data.topTown?.ordersToday ? ` • ${num(data.topTown?.ordersToday)} ${t('dashboard.metrics.orders', { defaultValue: 'orders' })}` : ''}`,
        change: '—',
        notes: '',
        calcInfo: 'Among delivered orders today, group by shippingAddress.town; pick town with most orders and sum amount'
      },

      // Newly displayed: Returning customers (Today)
      {
        name: t('dashboard.metrics.returningCustomersToday', { defaultValue: 'Returning Customers (Today)' }),
        value: num(data.today?.returningCustomersCount ?? data.customers?.returningToday),
        change: '—',
        notes: '',
        calcInfo: 'Count of customers with an order today who are not first-time (first order exists before today)'
      },
      {
        name: t('dashboard.metrics.ordersYesterday', { defaultValue: 'Orders (Yesterday)' }),
        value: num(data.today?.ordersYesterdayCount),
        change: '—',
        notes: '',
        calcInfo: 'Count of orders with createdAt in yesterday window'
      },
      {
        name: t('dashboard.metrics.deliveredYesterday', { defaultValue: 'Delivered (Yesterday)' }),
        value: num(data.today?.deliveredOrdersYesterdayCount),
        change: '—',
        notes: '',
        calcInfo: 'Count of orders with status = DELIVERED and deliveredAt in yesterday window'
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
            {data?.meta && (
              <div className={styles.textWeak}>
                {data?.meta?.timezone ? `${t('dashboard.meta.timezone', { defaultValue: 'Timezone' })}: ${data.meta.timezone}` : ''}
                {data?.meta?.currentDate ? ` • ${t('dashboard.meta.currentDate', { defaultValue: 'Date' })}: ${data.meta.currentDate}` : ''}
              </div>
            )}
          </div>

          <Button
            onClick={refresh}
            appearance="outline"
            isDisabled={isFetching}
            isLoading={isFetching}
            leftIcon={faSync}
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
                    stripedRows
                    title={t('dashboard.metrics.title', { defaultValue: 'Metrics' })}
                    columns={[
                      {
                        header: t('dashboard.metrics.metric', { defaultValue: 'Metric' }),
                        field: 'name',
                        body: (r: any) => (
                          <Flex align="center" spacing="xs">
                            <span>{r.name}</span>
                            {r.calcInfo && (
                              <Tooltip
                                content={
                                  <div style={{ maxWidth: 200, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                    {r.calcInfo}
                                  </div>
                                }
                                position="top"
                              >
                                <div>
                                  <Icon icon={faCircleInfo} color="gray"/>
                                </div>
                              </Tooltip>
                            )}
                          </Flex>
                        ),
                      },
                      { header: t('dashboard.metrics.value', { defaultValue: 'Value' }), field: 'value' },
                      { header: t('dashboard.metrics.change', { defaultValue: 'Change' }), field: 'change' },
                      { header: t('dashboard.metrics.notes', { defaultValue: 'Notes' }), field: 'notes' },
                    ]}
                    value={metricsRows}
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
                    <Flex spacing="xs" direction="vertical">
                      <Flex align="center" spacing="s">
                        <strong>{t('dashboard.goals.dailyOrders')}</strong>
                        <span className={styles.textWeak}>{pctFromBps(data.today?.ordersGoalProgressBps)}</span>
                      </Flex>

                      <ProgressBar
                        className=""
                        progress={clampPct(Number((data.today?.ordersGoalProgressBps ?? 0) / 100))}
                      />

                      <div className={styles.textWeak}>
                        {data.today?.ordersGoalProgressBps == null
                          ? t('dashboard.goals.noGoal', { defaultValue: 'No goal configured' })
                          : t('dashboard.goals.progress', {
                            defaultValue: '{{current}} / {{goal}}',
                            current: num(data.today?.ordersCount),
                            goal: t('dashboard.goals.goal', { defaultValue: 'goal' }),
                          })}
                      </div>
                    </Flex>

                    {/* Monthly */}
                    <Flex spacing="xs" direction="vertical">
                      <Flex align="center" spacing="s">
                        <strong>{t('dashboard.goals.monthlyRevenue', { defaultValue: 'Monthly Revenue Goal' })}</strong>
                        <span className={styles.textWeak}>{pctFromBps(data.monthly?.progressBps)}</span>
                      </Flex>

                      <ProgressBar
                        className=""
                        progress={clampPct(Number((data.monthly?.progressBps ?? 0) / 100))}
                      />

                      <div className={styles.textWeak}>
                        {data.monthly?.goal == null
                          ? t('dashboard.goals.monthlyNoGoal', {
                            defaultValue: '{{sales}}',
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
                    </Flex>
                  </div>
                </div>
                <div className={styles.sectionBlock}>
                  <Table
                    stripedRows
                    title={t('dashboard.topProducts.todayTitle', { defaultValue: 'Top Products (Today)' })}
                    columns={[
                      {
                        header: t('dashboard.table.product', { defaultValue: 'Product' }),
                        field: 'name',
                        body: (r: any) => (
                          <Button
                            align="start"
                            appearance="link" color="highlighted" withoutPadding
                            onClick={() => navigate(`/product/${r.productId}`)}>
                            {r.name}
                          </Button>
                        ),
                      },
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
                    value={(data.topProducts?.items ?? []).slice(0, 10)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
