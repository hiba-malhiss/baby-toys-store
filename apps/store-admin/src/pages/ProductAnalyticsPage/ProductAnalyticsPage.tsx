import React from 'react';
import {
  Button,
  StringInput,
  Flex,
  Heading,
  Calendar,
  Table,
  Tooltip,
  PageHeader,
  Icon,
} from '@baby-toys/ui-kit';
import { Info, Search } from 'lucide-react';
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
        <Flex align="center" spacing="xs">
          <span>{t('menu.productAnalytics.columns.trendingScore')}</span>
          <Tooltip content={t('menu.productAnalytics.trendingScoreTooltip')} position="top">
            <div>
              <Icon icon={Info} />
            </div>
          </Tooltip>
        </Flex>
      ),
      field: 'trendingScore',
      body: (r: ProductAnalyticsRow) => r.trendingScore.toFixed(2),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        left={
          <Flex direction="vertical" spacing="xs">
            <Heading>{t('menu.productAnalytics.title')}</Heading>
            <Heading level="h4" appearance="light">
              {t('menu.productAnalytics.subtitle')}
            </Heading>
          </Flex>
        }
        right={
          <Flex spacing="s" align="center">
            <StringInput
              value={productQuery}
              onChange={(e: any) => setProductQuery(e)}
              placeholder={t('menu.productAnalytics.searchPlaceholder')}
              iconRight={Search}
              withIconBackground
              onIconClick={applyFilters}
            />
            <Calendar
              value={moment(from + '-01', 'YYYY-MM-DD') as any}
              onChange={(m) => {
                const d = Array.isArray(m) ? m[0] : (m as any);
                if (!d) return;
                setFrom(
                  (d as any).format ? (d as any).format('YYYY-MM') : moment(d).format('YYYY-MM')
                );
              }}
              selectionMode="single"
              typeView="month"
            />
            <Calendar
              value={moment(to + '-01', 'YYYY-MM-DD') as any}
              onChange={(m) => {
                const d = Array.isArray(m) ? m[0] : (m as any);
                if (!d) return;
                setTo(
                  (d as any).format ? (d as any).format('YYYY-MM') : moment(d).format('YYYY-MM')
                );
              }}
              selectionMode="single"
              typeView="month"
            />
            <Button onClick={applyFilters}>{t('menu.productAnalytics.applyButton')}</Button>
          </Flex>
        }
      />

      <Table
        stripedRows
        columns={columns as any}
        value={rows}
        emptyMessage={t('menu.productAnalytics.emptyMessage')}
        onSort={handleSort as any}
        sortField={sortField}
        sortOrder={sortOrder}
        paginator
        isLoading={isFetching}
        rows={50}
        totalRecords={totalItems}
        onPageChange={(newPage: number) => setPage(newPage)}
      />
    </AdminLayout>
  );
};

export default ProductAnalyticsPage;
