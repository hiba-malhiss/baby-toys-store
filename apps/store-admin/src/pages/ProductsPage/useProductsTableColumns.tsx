import { Button, Flex, Rating, Icon, CopyToClipboardButton } from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2, Star, Check, Eye, X, Layers } from 'lucide-react';
import { useStoreSettings } from '../../api/settingsApi';
import styles from './ProductsPage.module.scss';
import { AdminProductBase } from '../../api/types/product.ts';

export const useProductsTableColumns = (handleDelete: (product: AdminProductBase) => void) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol;

  return [
    {
      field: 'id',
      header: t('table.headers.id'),
      body: (row: AdminProductBase) => (
        <Flex spacing="s" align="center">
          <span>#{row.id}</span>
          <CopyToClipboardButton
            value={row.id}
            successMessage={t('products.messages.copiedProductId')}
            ariaLabel={t('products.actions.copyProductId')}
            appearance="link"
          />
        </Flex>
      ),
    },
    {
      field: 'mainImage',
      header: t('table.headers.image'),
      type: 'image',
    },
    {
      field: 'name',
      header: t('table.headers.name'),
      sortable: false,
      body: (row: AdminProductBase) => (
        <span className={styles.productsPageTruncate} title={row.name || ''}>
          {row.name || '-'}
        </span>
      ),
    },
    {
      field: 'categoryName',
      header: t('table.headers.category'),
      sortable: false,
      body: (row: AdminProductBase) => row.categoryName || '-',
    },
    {
      field: 'price',
      header: t('table.headers.price'),
      sortable: true,
      body: (row: AdminProductBase) => {
        return row.defaultVariant?.price;
      },
    },
    {
      field: 'sales',
      header: t('table.headers.units'),
      sortable: true,
      body: (row: AdminProductBase) => (row.sales != null ? String(row.sales) : '-'),
    },
    {
      field: 'totalRevenue',
      header: t('table.headers.revenue'),
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
      header: t('table.headers.margin'),
      sortable: true,
      body: (row: AdminProductBase) =>
        row.profitMargin != null ? `${(Number(row.profitMargin) * 100).toFixed(1)}%` : '-',
    },
    {
      field: 'activeVariantsTotalStock',
      header: t('table.headers.stock'),
      sortable: true,
      body: (row: AdminProductBase) => {
        const stock = row.activeVariantsTotalStock ?? row.stockQuantity ?? 0;
        return <Icon icon={stock > 0 ? Check : X} color={stock > 0 ? 'success' : 'error'} />;
      },
    },
    {
      field: 'averageRating',
      header: t('table.headers.rating'),
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
      header: t('table.headers.releaseDate'),
      sortable: false,
      body: (row: AdminProductBase) => row.releaseDate || '-',
    },
    {
      field: 'actions',
      header: t('table.headers.actions'),
      body: (row: AdminProductBase) => (
        <Flex spacing="m">
          <Button
            size="small"
            appearance="outline"
            leftIconComp={Eye}
            onClick={() => navigate(`/product/${row.id}`)}
            aria-label={t('table.actions.view')}
            title={t('table.actions.view')}
          />
          <Button
            size="small"
            appearance="outline"
            leftIconComp={Pencil}
            onClick={() => navigate(`/edit-product/${row.id}`)}
            aria-label={t('table.actions.edit')}
            title={t('table.actions.edit')}
          />
          <Button
            size="small"
            appearance="outline"
            leftIconComp={Layers}
            onClick={() => navigate(`/edit-product/${row.id}/variations`)}
            aria-label={t('table.actions.variations')}
            title={t('table.actions.variations')}
          />
          <Button
            size="small"
            appearance="outline"
            leftIconComp={Star}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/reviews?productId=${row.id}`);
            }}
            aria-label={t('table.actions.reviews')}
            title={t('table.actions.reviews')}
          />
          <Button
            size="small"
            appearance="outline"
            leftIconComp={Trash2}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            aria-label={t('table.actions.delete')}
            title={t('table.actions.delete')}
          />
        </Flex>
      ),
    },
  ];
};
