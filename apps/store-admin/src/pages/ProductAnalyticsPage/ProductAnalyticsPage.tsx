import React from 'react';
import { Button, StringInput, Flex, Heading, Calendar, Table, Tooltip } from '@baby-toys/ui-kit';
import { Info } from 'lucide-react';
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

  const columns = [
    { header: 'Product ID', field: 'productId' },
    { header: 'Year', field: 'year', sortable: true },
    {
      header: 'Month',
      field: 'month',
      sortable: true,
      body: (r: ProductAnalyticsRow) => String(r.month).padStart(2, '0'),
    },
    { header: 'Views', field: 'viewsCount', sortable: true },
    { header: 'Wishlists', field: 'wishlistCount', sortable: true },
    { header: 'Added To Cart', field: 'addedToCartCount', sortable: true },
    {
      header: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span>Trending Score</span>
          <Tooltip
            content="Calculated as: 0.3 × Views + 0.4 × Wishlists + 0.8 × Add to Cart."
            position="top"
          >
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
            <Heading>Product Analytics</Heading>
            <Heading level="h4" appearance="light">
              Monthly counters for views, wishlists, and add-to-cart.
            </Heading>
          </Flex>
          <Flex spacing="s" align="center">
            <StringInput
              value={productQuery}
              onChange={(e: any) => setProductQuery(e)}
              placeholder="Product ID or SKU"
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
            <Button onClick={applyFilters}>Apply</Button>
          </Flex>
        </Flex>

        <Table
          stripedRows
          columns={columns as any}
          value={rows}
          emptyMessage="No analytics data"
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
