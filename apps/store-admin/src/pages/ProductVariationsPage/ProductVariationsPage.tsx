import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Flex, Button } from '@baby-toys/ui-kit';
import ProductVariations from './ProductVariations';
import { useProduct } from '../../api/productApi';
import VariationDialog from './VariationDialog.tsx';
import type { VariantDto } from '../../api/types/variant';

const ProductVariationsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const productId = id ? Number(id) : undefined;

  const { data: product } = useProduct(productId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VariantDto | null>(null);

  const productOptions = (product as any)?.options || [];

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (row: VariantDto) => {
    setEditing(row);
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const { t } = useTranslation('common');

  if (!productId) {
    return <AdminLayout>{t('app.errors.invalidProductId')}</AdminLayout>;
  }

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="l" fullWidth>
        <Flex justify="between" align="center" spacing="l" fullWidth>
          <Heading level="h3">{t('app.variation.manageVariations')}</Heading>
          <Flex justify="end" align="center" fullWidth>
            <Button onClick={openCreate}>{t('app.variation.addVariation')}</Button>
          </Flex>
        </Flex>
        <ProductVariations
          productId={productId}
          variants={product?.variants || []}
          openEdit={openEdit}
        />
        <VariationDialog
          productId={productId}
          isOpen={dialogOpen}
          onClose={closeDialog}
          productOptions={productOptions}
          productMainImage={(product as any)?.mainImage}
          productImages={(product as any)?.images || []}
          editing={editing}
        />
      </Flex>
    </AdminLayout>
  );
};

export default ProductVariationsPage;
