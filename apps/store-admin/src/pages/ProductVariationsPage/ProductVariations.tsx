import React, { useMemo, useState } from 'react';
import {
  Button,
  Table,
  Toggle,
  Image,
  ConfirmDialog,
  Flex,
  Tooltip,
  Chip,
  useToast,
  ImagePlaceholder,
} from '@baby-toys/ui-kit';
import { Pencil, Trash2, Plus, Square } from 'lucide-react';
import { useDeleteVariant, useUpdateVariant } from '../../api/variantApi';
import type { VariantDto } from '../../api/types/variant';
import { useTranslation } from 'react-i18next';
import styles from './product-variations.module.scss';

type Props = {
  productId: number;
  readOnly?: boolean;
  openEdit?: (row: VariantDto) => void;
  variants: VariantDto[];
  productOptions?: any[]; // Add productOptions prop
};

const PriceCell: React.FC<{
  price: number;
  oldPrice?: number | null;
  costPrice?: number | null;
}> = ({ price, oldPrice, costPrice }) => (
  <div className={styles.priceCell}>
    <span className={styles.priceSelling}>{price}</span>
    {oldPrice != null && oldPrice > 0 && <span className={styles.priceOld}>{oldPrice}</span>}
    {costPrice != null && costPrice > 0 && (
      <span className={styles.priceCost}>cost: {costPrice}</span>
    )}
  </div>
);

const StockCell: React.FC<{ qty: number }> = ({ qty }) => {
  const level = qty === 0 ? 'out' : qty <= 5 ? 'low' : 'ok';
  const appearance = level === 'out' ? 'error' : level === 'low' ? 'warning' : 'success';
  return <Chip label={String(qty)} appearance={appearance} size="small" />;
};

const ProductVariations: React.FC<Props> = ({
  openEdit,
  productId,
  readOnly = false,
  variants,
  productOptions, // Add productOptions prop
}) => {
  const toast = useToast();
  const { t } = useTranslation();

  const deleteVariant = useDeleteVariant(productId);
  const updateVariant = useUpdateVariant(productId);

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Helper to convert optionSelectionIds to displayable option strings
  const getVariantOptions = (variant: VariantDto) => {
    if (!variant.optionSelectionIds || !productOptions) return [];

    return productOptions
      .map((opt: any) => {
        const selectedValueId = variant.optionSelectionIds?.[opt.type.id];
        if (!selectedValueId) return null;

        const selectedValue = opt.values.find((val: any) => val.id === selectedValueId);
        return selectedValue?.translations?.[0]?.display || '';
      })
      .filter(Boolean);
  };

  const toggleActive = (row: VariantDto, next: boolean) => {
    updateVariant.mutate(
      { variantId: row.id, payload: { isActive: next } },
      {
        onSuccess: () => toast.success(t('app.variation.updateSuccess')),
        onError: (e: any) => toast.error(e?.response?.data?.message || t('app.unexpectedError')),
      }
    );
  };

  const confirmDelete = () => {
    if (!confirmDeleteId) return;
    deleteVariant.mutate(confirmDeleteId, {
      onSuccess: () => {
        toast.success(t('app.variation.deleteSuccess'));
        setConfirmDeleteId(null);
      },
      onError: (e: any) => toast.error(e?.response?.data?.message || t('app.unexpectedError')),
    });
  };

  const columns = useMemo(() => {
    const base: any[] = [
      {
        header: t('app.variation.image'),
        field: 'mainImage',
        body: (row: VariantDto) =>
          row.mainImage ? (
            <Image src={row.mainImage} alt={row.sku} width={50} height={50} />
          ) : (
            <ImagePlaceholder width={50} height={50} />
          ),
      },
      {
        header: t('app.variation.combination'),
        field: 'options',
        body: (row: VariantDto) => {
          const options = getVariantOptions(row);
          return options?.length ? (
            <Flex spacing="xs" wrap>
              {options.map((opt, i) => (
                <Chip key={i} label={opt} appearance="outline" size="small" />
              ))}
            </Flex>
          ) : (
            <span className={styles.dimText}>—</span>
          );
        },
      },
      {
        header: 'SKU',
        field: 'sku',
        body: (row: VariantDto) => <span className={styles.skuText}>{row.sku || '—'}</span>,
      },
      {
        header: t('app.variation.price'),
        field: 'price',
        body: (row: VariantDto) => (
          <PriceCell price={row.price} oldPrice={row.oldPrice} costPrice={row.costPrice} />
        ),
      },
      {
        header: t('app.variation.stock'),
        field: 'stockQuantity',
        body: (row: VariantDto) => <StockCell qty={row.stockQuantity} />,
      },
      {
        header: t('app.variation.active'),
        field: 'isActive',
        body: (row: VariantDto) =>
          readOnly ? (
            <span className={row.isActive ? styles.activeYes : styles.activeNo}>
              {row.isActive ? t('app.yes') : t('app.no')}
            </span>
          ) : (
            <Toggle value={row.isActive} onChange={(val) => toggleActive(row, !!val)} />
          ),
      },
    ];

    if (!readOnly) {
      base.push({
        header: '',
        field: 'actions',
        body: (row: VariantDto) => (
          <Flex spacing="s">
            <Tooltip position="top" content={t('common.edit')}>
              <Button
                size="small"
                appearance="outline"
                leftIconComp={Pencil}
                onClick={() => openEdit?.(row)}
                aria-label={t('common.edit')}
              />
            </Tooltip>
            <Tooltip position="top" content={t('common.delete')}>
              <Button
                size="small"
                appearance="outline"
                leftIconComp={Trash2}
                onClick={() => setConfirmDeleteId(row.id)}
                aria-label={t('common.delete')}
              />
            </Tooltip>
          </Flex>
        ),
      });
    }

    return base;
  }, [updateVariant, readOnly]);

  return (
    <>
      <Table
        value={variants}
        columns={columns}
        paginator={false}
        stripedRows
        emptyMessage={
          <div className={styles.emptyState}>
            <div style={{ position: 'relative', width: 40, height: 40 }}>
              <Square width={40} height={40} opacity={0.3} />
              <Plus
                width={24}
                height={24}
                style={{ position: 'absolute', top: 8, left: 8 }}
                opacity={0.5}
              />
            </div>
            <p>{t('app.variation.noVariations')}</p>
          </div>
        }
      />
      <ConfirmDialog
        visible={!!confirmDeleteId}
        header={t('app.variation.confirmDelete.title')}
        message={t('app.variation.confirmDelete.message')}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
        confirmLabel={t('app.variation.confirmDelete.confirm')}
        cancelLabel={t('app.variation.confirmDelete.cancel')}
      />
    </>
  );
};

export default ProductVariations;
