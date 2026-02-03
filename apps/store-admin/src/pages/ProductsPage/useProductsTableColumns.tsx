import { Button, Flex, Rating, Icon, CopyToClipboardButton } from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Star, Check, Eye, X } from 'lucide-react';
import { useStoreSettings } from '../../api/settingsApi';
import styles from './ProductsPage.module.scss';
import { AdminProductBase } from '../../api/types/product.ts';

export const useProductsTableColumns = (handleDelete: (product: AdminProductBase) => void) => {
  const navigate = useNavigate();
  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol;

  return [
    {
      field: 'id',
      header: 'ID',
      body: (row: AdminProductBase) => (
        <Flex spacing="s" align="center">
          <span>#{row.id}</span>
          <CopyToClipboardButton
            value={row.id}
            successMessage="Product ID copied"
            ariaLabel="Copy product ID"
            appearance="link"
          />
        </Flex>
      ),
    },
    {
      field: 'mainImage',
      header: 'Image',
      type: 'image',
    },
    {
      field: 'name',
      header: 'Name',
      sortable: false,
      body: (row: AdminProductBase) => (
        <span className={styles.productsPageTruncate} title={row.name || ''}>
          {row.name || '-'}
        </span>
      ),
    },
    {
      field: 'brandName',
      header: 'Brand',
      sortable: false,
      body: (row: AdminProductBase) => row.brandName || '-',
    },
    {
      field: 'categoryName',
      header: 'Category',
      sortable: false,
      body: (row: AdminProductBase) => row.categoryName || '-',
    },
    {
      field: 'lowestActivePrice',
      header: 'Price',
      sortable: true,
      body: (row: AdminProductBase) => {
        const p = row.lowestActivePrice ?? row.price;
        return p != null ? (symbol ? `From ${symbol}${p}` : `From ${String(p)}`) : '-';
      },
    },
    {
      field: 'sales',
      header: 'Units',
      sortable: true,
      body: (row: AdminProductBase) => (row.sales != null ? String(row.sales) : '-'),
    },
    {
      field: 'totalRevenue',
      header: 'Revenue',
      sortable: true,
      body: (row: AdminProductBase) =>
        row.totalRevenue != null
          ? symbol
            ? `${symbol}${row.totalRevenue}`
            : String(row.totalRevenue)
          : '-',
    },
    {
      field: 'profitMargin',
      header: 'Margin',
      sortable: true,
      body: (row: AdminProductBase) =>
        row.profitMargin != null ? `${(Number(row.profitMargin) * 100).toFixed(1)}%` : '-',
    },
    {
      field: 'activeVariantsTotalStock',
      header: 'Stock',
      sortable: true,
      body: (row: AdminProductBase) => {
        const stock = row.activeVariantsTotalStock ?? row.stockQuantity ?? 0;
        return <Icon icon={stock > 0 ? Check : X} color={stock > 0 ? 'success' : 'error'} />;
      },
    },
    {
      field: 'averageRating',
      header: 'Rating',
      body: (row: AdminProductBase) =>
        row.averageRating ? (
          <Flex spacing="xs">
            <Rating value={row.averageRating} />
            <span>({row.numberOfRatings || 0})</span>
          </Flex>
        ) : (
          <span>-</span>
        ),
    },
    {
      field: 'releaseDate',
      header: 'Release Date',
      sortable: false,
      body: (row: AdminProductBase) => row.releaseDate || '-',
    },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: AdminProductBase) => (
        <Flex spacing="m">
          <Button
            size="small"
            appearance="outline"
            leftIconComp={Eye}
            onClick={() => navigate(`/product/${row.id}`)}
            aria-label="View product"
          />
          <Button
            size="small"
            appearance="outline"
            leftIconComp={Pencil}
            onClick={() => navigate(`/edit-product/${row.id}`)}
          />
          <Button
            size="small"
            appearance="outline"
            leftIconComp={Star}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/reviews?productId=${row.id}`);
            }}
          />
          <Button
            size="small"
            appearance="outline"
            leftIconComp={Trash2}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          />
        </Flex>
      ),
    },
  ];
};
