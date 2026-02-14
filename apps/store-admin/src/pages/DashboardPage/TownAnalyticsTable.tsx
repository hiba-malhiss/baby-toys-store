import React, { useMemo } from 'react';
import { Table, Heading, Chip } from '@baby-toys/ui-kit';
import { useTownAnalytics } from '../../api/townAnalyticsApi';
import { useStoreSettings } from '../../api/settingsApi';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

export default function TownAnalyticsTable() {
  const { data, isLoading } = useTownAnalytics();
  const { data: settings } = useStoreSettings();
  const { t } = useTranslation();

  const currencyCode = settings?.general?.currency || 'USD';
  const locale = i18n.language;
  const currencyFmt = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 2,
      }),
    [locale, currencyCode]
  );

  const rows = useMemo(() => data ?? [], [data]);

  return (
    <div>
      <Heading level="h3" className="bts-marginBxs">
        {t('townAnalytics.title')}
      </Heading>
      <Table
        stripedRows
        isLoading={isLoading}
        columns={[
          { header: t('townAnalytics.columns.townCode'), field: 'townCode' },
          { header: t('townAnalytics.columns.ordersLast30Days'), field: 'ordersLast30Days' },
          {
            header: t('townAnalytics.columns.revenueLast30Days'),
            field: 'revenueLast30Days',
            body: (r: any) => currencyFmt.format(Number(r.revenueLast30Days ?? 0)),
          },
          {
            header: t('townAnalytics.columns.averageOrderValueLast30Days'),
            field: 'averageOrderValueLast30Days',
            body: (r: any) => currencyFmt.format(Number(r.averageOrderValueLast30Days ?? 0)),
          },
          {
            header: t('townAnalytics.columns.ordersPrevious30Days'),
            field: 'ordersPrevious30Days',
          },
          {
            header: t('townAnalytics.columns.revenuePrevious30Days'),
            field: 'revenuePrevious30Days',
            body: (r: any) => currencyFmt.format(Number(r.revenuePrevious30Days ?? 0)),
          },
          {
            header: t('townAnalytics.columns.ordersGrowthRate'),
            field: 'ordersGrowthRate',
            body: (r: any) => {
              const prev = Number(r.ordersPrevious30Days ?? 0);
              const last = Number(r.ordersLast30Days ?? 0);
              if (prev === 0 && last > 0)
                return <Chip tone="highlighted">{t('townAnalytics.growth.new')}</Chip>;
              if (prev === 0 && last === 0) return t('townAnalytics.growth.noData');
              const pct = Number(r.ordersGrowthRate ?? 0) * 100;
              return <Chip tone={pct >= 0 ? 'success' : 'danger'}>{pct.toFixed(2)}%</Chip>;
            },
          },
          {
            header: t('townAnalytics.columns.revenueGrowthRate'),
            field: 'revenueGrowthRate',
            body: (r: any) => {
              const prev = Number(r.revenuePrevious30Days ?? 0);
              const last = Number(r.revenueLast30Days ?? 0);
              if (prev === 0 && last > 0)
                return <Chip tone="highlighted">{t('townAnalytics.growth.new')}</Chip>;
              if (prev === 0 && last === 0) return t('townAnalytics.growth.noData');
              const pct = Number(r.revenueGrowthRate ?? 0) * 100;
              return <Chip tone={pct >= 0 ? 'success' : 'danger'}>{pct.toFixed(2)}%</Chip>;
            },
          },
          {
            header: t('townAnalytics.columns.failedDeliveriesLast30Days'),
            field: 'failedDeliveriesLast30Days',
          },
          {
            header: t('townAnalytics.columns.guestOrdersLast30Days'),
            field: 'guestOrdersLast30Days',
          },
          {
            header: t('townAnalytics.columns.refreshedAt'),
            field: 'refreshedAt',
            body: (r: any) =>
              r.refreshedAt
                ? new Date(r.refreshedAt).toLocaleString(locale)
                : t('townAnalytics.growth.noData'),
          },
        ]}
        value={rows}
      />
    </div>
  );
}
