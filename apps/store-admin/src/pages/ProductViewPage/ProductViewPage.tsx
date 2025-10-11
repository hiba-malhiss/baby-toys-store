import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Heading, KPI, Chip } from '@baby-toys/ui-kit';
import { CopyToClipboardButton } from '../../components/CopyToClipboardButton/CopyToClipboardButton';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useProduct } from '../../api/productApi';
import { useStoreSettings } from '../../api/settingsApi';
import styles from './product-view-page.module.scss';

const StatRow: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
    <span style={{ opacity: 0.8 }}>{label}</span>
    <span style={{ justifySelf: 'end' }}>{value ?? '-'}</span>
  </div>
);

const ProductViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(productId);
  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol || '';

  const formatMoney = (val?: number | null) =>
    val != null ? `${symbol}${Number(val).toLocaleString()}` : '-';
  const formatPercent = (val?: number | null) =>
    val != null ? `${(Number(val) * 100).toFixed(2)}%` : '-';
  const formatDate = (val?: string | null) => (val ? new Date(val).toLocaleString() : '-');

  // Using shared KPI component from UI Kit

  return (
    <AdminLayout isLoading={isLoading || !product}>
      <div className={styles.container}>
        {/* Hero header */}
        <Card>
          <div className={styles.heroCardGrid}>
            <div className={styles.heroLeftGrid}>
              {product?.mainImage && (
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className={styles.mainImage}
                />
              )}
              <div>
                <Heading level="h1" className={styles.title}>
                  {product?.name || 'Product'}
                </Heading>
                <div className={styles.idRow}>
                  <span className={styles.fadedId}>ID #{product?.id}</span>
                  {product?.id != null && (
                    <CopyToClipboardButton
                      value={product.id}
                      successMessage="Product ID copied"
                      ariaLabel="Copy product ID"
                      appearance="link"
                    />
                  )}
                </div>
                <div className={styles.brandRow}>
                  <span className={styles.faded}>
                    {product?.brandName || '-'} • {product?.categoryName || '-'}
                  </span>
                  {!product?.isActive && <Chip label="Inactive" appearance="error" />}
                </div>
              </div>
            </div>
            <div>
              <Button
                leftIcon={faPen}
                appearance="outline"
                onClick={() => navigate(`/edit-product/${product?.id}`)}
              >
                Edit Product
              </Button>
            </div>
          </div>
        </Card>

        {/* KPI row */}
        <div className={styles.kpiGrid}>
          <KPI label="Price" value={formatMoney(product?.price)} />
          <KPI label="Cost" value={formatMoney(product?.costPrice)} />
          <KPI label="Revenue (lifetime)" value={formatMoney(product?.totalRevenue)} />
          <KPI label="Profit (lifetime)" value={formatMoney(product?.totalProfit)} />
          <KPI label="Margin" value={formatPercent(product?.profitMargin)} />
        </div>

        {/* Content grid */}
        <div className={styles.contentGrid}>
          <Card header={<Heading level="h3">Inventory</Heading>}>
            <div className={styles.cardBodyGrid}>
              <StatRow label="Stock" value={product?.stockQuantity} />
              <StatRow label="Units Sold" value={product?.sales ?? 0} />
              <StatRow label="Release Date" value={formatDate(product?.releaseDate)} />
              <StatRow label="Active" value={product?.isActive ? 'Yes' : 'No'} />
            </div>
          </Card>

          <Card header={<Heading level="h3">Pricing</Heading>}>
            <div className={styles.cardBodyGrid}>
              <StatRow label="List Price" value={formatMoney(product?.price)} />
              <StatRow label="Cost Price" value={formatMoney(product?.costPrice)} />
              <StatRow label="Old Price" value={formatMoney(product?.oldPrice)} />
            </div>
          </Card>
        </div>

        <div className={styles.contentGrid}>
          <Card header={<Heading level="h3">Classification</Heading>}>
            <div className={styles.cardBodyGrid}>
              <StatRow label="Category" value={product?.categoryName ?? '-'} />
              <StatRow label="Brand" value={product?.brandName ?? '-'} />
              <StatRow label="Colors" value={product?.colorCodes?.join(', ') || '-'} />
              <StatRow label="Materials" value={product?.materialNames?.join(', ') || '-'} />
            </div>
          </Card>

          <Card header={<Heading level="h3">Meta</Heading>}>
            <div className={styles.cardBodyGrid}>
              <StatRow label="Created" value={formatDate(product?.createdAt)} />
              <StatRow label="Updated" value={formatDate(product?.updatedAt)} />
            </div>
          </Card>
        </div>

        {/* Image gallery */}
        {product?.images && product.images.length > 0 && (
          <Card header={<Heading level="h3">Images</Heading>}>
            <div className={styles.imagesGrid}>
              {product.images.map((src, idx) => (
                <img key={`${src}-${idx}`} src={src} alt={`Product image ${idx + 1}`} className={styles.thumb} />
              ))}
            </div>
          </Card>
        )}

        {/* Descriptions */}
        {(product?.shortDescription || product?.description) && (
          <Card header={<Heading level="h3">Content</Heading>}>
            <div className={styles.contentTextGrid}>
              {product?.shortDescription && (
                <Card header={<Heading level="h4">Short Description</Heading>}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{product.shortDescription}</div>
                </Card>
              )}
              {product?.description && (
                <Card header={<Heading level="h4">Description</Heading>}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{product.description}</div>
                </Card>
              )}
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductViewPage;
