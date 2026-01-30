import React, { useMemo } from 'react';
import { Table, Heading, Chip } from '@baby-toys/ui-kit';
import { useTownAnalytics } from '../../api/townAnalyticsApi';
import { useStoreSettings } from '../../api/settingsApi';
import { useTranslation } from 'react-i18next';

export default function TownAnalyticsTable() {
  const { data, isLoading } = useTownAnalytics();
  const { data: settings } = useStoreSettings();
  const { i18n } = useTranslation();

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
        Town Analytics (Last 30 Days)
      </Heading>
      <Table
        stripedRows
        isLoading={isLoading}
        columns={[
          { header: 'Town', field: 'townCode' },
          { header: 'Orders (30d)', field: 'ordersLast30Days' },
          {
            header: 'Revenue (30d)',
            field: 'revenueLast30Days',
            body: (r: any) => currencyFmt.format(Number(r.revenueLast30Days ?? 0)),
          },
          {
            header: 'AOV (30d)',
            field: 'averageOrderValueLast30Days',
            body: (r: any) => currencyFmt.format(Number(r.averageOrderValueLast30Days ?? 0)),
          },
          { header: 'Orders (Prev 30d)', field: 'ordersPrevious30Days' },
          {
            header: 'Revenue (Prev 30d)',
            field: 'revenuePrevious30Days',
            body: (r: any) => currencyFmt.format(Number(r.revenuePrevious30Days ?? 0)),
          },
          {
            header: 'Orders Growth',
            field: 'ordersGrowthRate',
            body: (r: any) => {
              const prev = Number(r.ordersPrevious30Days ?? 0);
              const last = Number(r.ordersLast30Days ?? 0);
              if (prev === 0 && last > 0) return <Chip tone="highlighted">NEW</Chip>;
              if (prev === 0 && last === 0) return '—';
              const pct = Number(r.ordersGrowthRate ?? 0) * 100;
              return <Chip tone={pct >= 0 ? 'success' : 'danger'}>{pct.toFixed(2)}%</Chip>;
            },
          },
          {
            header: 'Revenue Growth',
            field: 'revenueGrowthRate',
            body: (r: any) => {
              const prev = Number(r.revenuePrevious30Days ?? 0);
              const last = Number(r.revenueLast30Days ?? 0);
              if (prev === 0 && last > 0) return <Chip tone="highlighted">NEW</Chip>;
              if (prev === 0 && last === 0) return '—';
              const pct = Number(r.revenueGrowthRate ?? 0) * 100;
              return <Chip tone={pct >= 0 ? 'success' : 'danger'}>{pct.toFixed(2)}%</Chip>;
            },
          },
          { header: 'Failed (30d)', field: 'failedDeliveriesLast30Days' },
          { header: 'Guest Orders (30d)', field: 'guestOrdersLast30Days' },
          {
            header: 'Refreshed At',
            field: 'refreshedAt',
            body: (r: any) =>
              r.refreshedAt ? new Date(r.refreshedAt).toLocaleString(locale) : '—',
          },
        ]}
        value={rows}
      />
    </div>
  );
}
