import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Flex, Button } from '@baby-toys/ui-kit';
import { ArrowLeft } from 'lucide-react';
import ProductVariations from './ProductVariations';
import { useProduct } from '../../api/productApi';
import VariationDialog from './VariationDialog.tsx';
import type { VariantDto } from '../../api/types/variant';
import styles from './product-variations.module.scss';

const ProductVariationsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const productId = id ? Number(id) : undefined;
  const navigate = useNavigate();

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

  const variants = product?.variants || [];
  const activeCount = variants.filter((v) => v.isActive).length;

  return (
    <AdminLayout>
      <div className={styles.pageLayout}>
        {/* Back nav */}
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate(`/edit-product/${productId}`)}
        >
          <ArrowLeft size={15} />
          {t('productForm.backToProduct', { defaultValue: 'Back to Product' })}
        </button>

        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <Heading level="h3">{t('app.variation.manageVariations')}</Heading>
            {product?.name && <p className={styles.productName}>{product.name}</p>}
          </div>

          <div className={styles.headerRight}>
            {variants.length > 0 && (
              <div className={styles.variantStats}>
                <span className={styles.statItem}>
                  <span className={styles.statNum}>{variants.length}</span>
                  {t('app.variation.total', { defaultValue: 'total' })}
                </span>
                <span className={styles.statDivider} />
                <span className={styles.statItem}>
                  <span className={`${styles.statNum} ${styles.statNumGreen}`}>{activeCount}</span>
                  {t('app.variation.active', { defaultValue: 'active' })}
                </span>
              </div>
            )}
            <Button onClick={openCreate}>{t('app.variation.addVariation')}</Button>
          </div>
        </div>

        {/* Table */}
        <ProductVariations
          productId={productId}
          variants={variants}
          productOptions={productOptions}
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
      </div>
    </AdminLayout>
  );
};

export default ProductVariationsPage;
