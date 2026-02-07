import React, { useMemo, useState } from 'react';
import { Button, Table, Toggle, Image, ConfirmDialog, Flex } from '@baby-toys/ui-kit';
import { useToast } from '@baby-toys/ui-kit';
import { Pencil, Trash2 } from 'lucide-react';
import { useDeleteVariant, useUpdateVariant } from '../../api/variantApi';

import type { VariantDto } from '../../api/types/variant';

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

  const deleteVariant = useDeleteVariant(productId);
  const updateVariant = useUpdateVariant(productId);

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const toggleActive = (row: VariantDto, next: boolean) => {
    updateVariant.mutate(
      { variantId: row.id, payload: { isActive: next } },
      {
        onSuccess: () => toast.success('Variant updated'),
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to update variant'),
      }
    );
  };

  const confirmDelete = () => {
    if (!confirmDeleteId) return;

    deleteVariant.mutate(confirmDeleteId, {
      onSuccess: () => {
        toast.success('Variant deleted');
        setConfirmDeleteId(null);
      },
      onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to delete variant'),
    });
  };

  const columns = useMemo(() => {
    const base = [
      {
        header: 'Image',
        field: 'mainImage',
        body: (row: VariantDto) =>
          row.mainImage ? (
            <Image
              src={row.mainImage}
              alt="variant"
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
        header: 'Combination',
        field: 'options',
        body: (row: VariantDto) => row.options?.join(' · ') || '-',
      },
      { header: 'Price', field: 'price' },
      { header: 'Old Price', field: 'oldPrice' },
      { header: 'Cost', field: 'costPrice' },
      { header: 'Stock', field: 'stockQuantity' },
      {
        header: 'Active',
        field: 'isActive',
        body: (row: VariantDto) =>
          readOnly ? (
            row.isActive ? (
              'Yes'
            ) : (
              'No'
            )
          ) : (
            <Toggle value={row.isActive} onChange={(val) => toggleActive(row, !!val)} />
          ),
      },
    ] as any[];

    if (!readOnly) {
      base.push({
        header: 'Actions',
        field: 'actions',
        body: (row: VariantDto) => (
          <Flex spacing="s">
            <Button
              size="small"
              appearance="outline"
              leftIconComp={Pencil}
              onClick={() => openEdit(row)}
            />
            <Button
              size="small"
              appearance="outline"
              leftIconComp={Trash2}
              onClick={() => setConfirmDeleteId(row.id)}
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
        emptyMessage="No variations yet."
      />
      <ConfirmDialog
        visible={!!confirmDeleteId}
        header="Confirm Delete"
        message={`Are you sure you want to delete this variant? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </>
  );
};

export default ProductVariations;
