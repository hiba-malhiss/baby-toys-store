import React from 'react';
import { Button, StringInput, Flex, Heading, Calendar, Table, Tooltip } from '@baby-toys/ui-kit';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import moment from 'moment';
import { type ProductAnalyticsRow } from '../../api/analyticsApi';
import { useProductAnalyticsPage } from './useProductAnalyticsPage';

const ProductAnalyticsPage: React.FC = () => {
  const {
    productQuery,
    setProductQuery,
    from,
    setFrom,
    to,
    setTo,
    sortField,
    sortOrder,
    handleSort,
    setPage,
    rows,
    totalItems,
    isFetching,
    applyFilters,
  } = useProductAnalyticsPage();
  const { t } = useTranslation();

  const columns = [
    { header: t('menu.productAnalytics.columns.productId'), field: 'productId' },
    { header: t('menu.productAnalytics.columns.year'), field: 'year', sortable: true },
    {
      header: t('menu.productAnalytics.columns.month'),
      field: 'month',
      sortable: true,
      body: (r: ProductAnalyticsRow) => String(r.month).padStart(2, '0'),
    },
    { header: t('menu.productAnalytics.columns.viewsCount'), field: 'viewsCount', sortable: true },
    {
      header: t('menu.productAnalytics.columns.wishlistCount'),
      field: 'wishlistCount',
      sortable: true,
    },
    {
      header: t('menu.productAnalytics.columns.addedToCartCount'),
      field: 'addedToCartCount',
      sortable: true,
    },
    {
      header: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span>{t('menu.productAnalytics.columns.trendingScore')}</span>
          <Tooltip content={t('menu.productAnalytics.trendingScoreTooltip')} position="top">
            <span>
              <Info style={{ opacity: 0.7, cursor: 'help' }} />
            </span>
          </Tooltip>
        </span>
      ),
      field: 'trendingScore',
      body: (r: ProductAnalyticsRow) => r.trendingScore.toFixed(2),
    },
  ];

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Flex direction="vertical" spacing="s">
            <Heading>{t('menu.productAnalytics.title')}</Heading>
            <Heading level="h4" appearance="light">
              {t('menu.productAnalytics.subtitle')}
            </Heading>
          </Flex>
          <Flex spacing="s" align="center">
            <StringInput
              value={productQuery}
              onChange={(e: any) => setProductQuery(e)}
              placeholder={t('menu.productAnalytics.searchPlaceholder')}
            />
            <Calendar
              value={moment(from + '-01', 'YYYY-MM-DD') as any}
              onChange={(m) => {
                const d = Array.isArray(m) ? m[0] : (m as any);
                if (!d) return;
                const ym = (d as any).format
                  ? (d as any).format('YYYY-MM')
                  : moment(d).format('YYYY-MM');
                setFrom(ym);
              }}
              selectionMode="single"
              typeView="month"
            />
            <Calendar
              value={moment(to + '-01', 'YYYY-MM-DD') as any}
              onChange={(m) => {
                const d = Array.isArray(m) ? m[0] : (m as any);
                if (!d) return;
                const ym = (d as any).format
                  ? (d as any).format('YYYY-MM')
                  : moment(d).format('YYYY-MM');
                setTo(ym);
              }}
              selectionMode="single"
              typeView="month"
            />
            <Button onClick={applyFilters}>{t('menu.productAnalytics.applyButton')}</Button>
          </Flex>
        </Flex>

        <Table
          stripedRows
          columns={columns as any}
          value={rows}
          emptyMessage={t('menu.productAnalytics.emptyMessage')}
          bordered
          striped
          onSort={handleSort as any}
          sortField={sortField}
          sortOrder={sortOrder}
          paginator
          isLoading={isFetching}
          rows={50}
          totalRecords={totalItems}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      </Flex>
    </AdminLayout>
  );
};

export default ProductAnalyticsPage;
