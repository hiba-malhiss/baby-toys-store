import React, { useMemo, useState } from 'react';
import { Button, Table, Toggle, Image, ConfirmDialog, Flex } from '@baby-toys/ui-kit';
import { useToast } from '@baby-toys/ui-kit';
import { Pencil, Trash2 } from 'lucide-react';
import { useDeleteVariant, useUpdateVariant } from '../../api/variantApi';

import type { VariantDto } from '../../api/types/variant';
import { useTranslation } from 'react-i18next';

type Props = {
  productId: number;
  readOnly?: boolean;
  openEdit?: (row: VariantDto) => void;
  variants: VariantDto[];
};

const ProductVariations: React.FC<Props> = ({
  openEdit,
  productId,
  readOnly = false,
  variants,
}) => {
  const toast = useToast();
  const { t } = useTranslation();

  const deleteVariant = useDeleteVariant(productId);
  const updateVariant = useUpdateVariant(productId);

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

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
    const base = [
      {
        header: t('app.variation.image'),
        field: 'mainImage',
        body: (row: VariantDto) =>
          row.mainImage ? (
            <Image
              src={row.mainImage}
              alt={t('app.variation.image')}
              style={{
                width: 40,
                height: 40,
                objectFit: 'cover',
                borderRadius: 4,
              }}
            />
          ) : (
            '-'
          ),
      },
      { header: 'SKU', field: 'sku' },
      {
        header: t('app.variation.combination'),
        field: 'options',
        body: (row: VariantDto) => row.options?.join(' · ') || '-',
      },
      { header: t('app.variation.price'), field: 'price' },
      { header: t('app.variation.oldPrice'), field: 'oldPrice' },
      { header: t('app.variation.costPrice'), field: 'costPrice' },
      { header: t('app.variation.stock'), field: 'stockQuantity' },
      {
        header: t('app.variation.active'),
        field: 'isActive',
        body: (row: VariantDto) =>
          readOnly ? (
            row.isActive ? (
              t('app.yes')
            ) : (
              t('app.no')
            )
          ) : (
            <Toggle value={row.isActive} onChange={(val) => toggleActive(row, !!val)} />
          ),
      },
    ] as any[];

    if (!readOnly) {
      base.push({
        header: t('app.actions'),
        field: 'actions',
        body: (row: VariantDto) => (
          <Flex spacing="s">
            <Button
              size="small"
              appearance="outline"
              leftIconComp={Pencil}
              onClick={() => openEdit(row)}
              aria-label={t('app.common.edit')}
            />
            <Button
              size="small"
              appearance="outline"
              leftIconComp={Trash2}
              onClick={() => setConfirmDeleteId(row.id)}
              aria-label={t('app.common.delete')}
            />
          </Flex>
        ),
      });
    }

    return base;
  }, [updateVariant, toast, readOnly]);

  return (
    <>
      <Table
        value={variants}
        columns={columns as any}
        paginator={false}
        stripedRows
        emptyMessage={t('app.variation.noVariations')}
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
