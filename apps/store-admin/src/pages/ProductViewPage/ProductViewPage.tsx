import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Heading, KPI, Chip, CopyToClipboardButton } from '@baby-toys/ui-kit';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useProduct } from '../../api/productApi';
import { useStoreSettings } from '../../api/settingsApi';
import styles from './product-view-page.module.scss';
import KPIWithTooltip from '../../components/KPIWithTooltip/KPIWithTooltip';
import { useTranslation } from 'react-i18next';

const StatRow: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
    <span style={{ opacity: 0.8 }}>{label}</span>
    <span style={{ justifySelf: 'end' }}>{value ?? '-'}</span>
  </div>
);

const ProductViewPage: React.FC = () => {
  const { t } = useTranslation();
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
                  {product?.name || t('productView.fallbackName')}
                </Heading>
                <div className={styles.idRow}>
                  <span className={styles.fadedId}>
                    {t('productView.idLabel', { id: product?.id })}
                  </span>
                  {product?.id != null && (
                    <CopyToClipboardButton
                      value={product.id}
                      successMessage={t('productView.productIdCopied')}
                      ariaLabel={t('productView.copyProductId')}
                      appearance="link"
                    />
                  )}
                </div>
                <div className={styles.brandRow}>
                  <span className={styles.faded}>
                    {product?.brandName || '-'} • {product?.categoryName || '-'}
                  </span>
                  {!product?.isActive && <Chip label={t('productView.inactive')} appearance="error" />}
                </div>
              </div>
            </div>
            <div>
              <Button
                leftIcon={faPen}
                appearance="outline"
                onClick={() => navigate(`/edit-product/${product?.id}`)}
              >
                {t('productView.editProduct')}
              </Button>
            </div>
          </div>
        </Card>

        {/* KPI row */}
        <div className={styles.kpiGrid}>
          <KPI label={t('productView.price')} value={formatMoney(product?.price)} />
          <KPI label={t('productView.cost')} value={formatMoney(product?.costPrice)} />
          <KPIWithTooltip
            label={t('productView.revenueLifetime')}
            tooltip={t('tooltips.productKPIs.revenueLifetime')}
            value={formatMoney(product?.totalRevenue)}
          />
          <KPIWithTooltip
            label={t('productView.profitLifetime')}
            tooltip={t('tooltips.productKPIs.profitLifetime')}
            value={formatMoney(product?.totalProfit)}
          />
          <KPIWithTooltip
            label={t('productView.margin')}
            tooltip={t('tooltips.productKPIs.margin')}
            value={formatPercent(product?.profitMargin)}
          />
        </div>

        {/* Content grid */}
        <div className={styles.contentGrid}>
          <Card header={<Heading level="h3">{t('productView.inventory')}</Heading>}>
            <div className={styles.cardBodyGrid}>
              <StatRow label={t('productView.stock')} value={product?.stockQuantity} />
              <StatRow label={t('productView.unitsSold')} value={product?.sales ?? 0} />
              <StatRow label={t('productView.releaseDate')} value={formatDate(product?.releaseDate)} />
              <StatRow
                label={t('productView.active')}
                value={product?.isActive ? t('app.yes') : t('app.no')}
              />
            </div>
          </Card>

          <Card header={<Heading level="h3">{t('productView.pricing')}</Heading>}>
            <div className={styles.cardBodyGrid}>
              <StatRow label={t('productView.listPrice')} value={formatMoney(product?.price)} />
              <StatRow label={t('productView.costPrice')} value={formatMoney(product?.costPrice)} />
              <StatRow label={t('productView.oldPrice')} value={formatMoney(product?.oldPrice)} />
            </div>
          </Card>
        </div>

        <div className={styles.contentGrid}>
          <Card header={<Heading level="h3">{t('productView.classification')}</Heading>}>
            <div className={styles.cardBodyGrid}>
              <StatRow label={t('productView.category')} value={product?.categoryName ?? '-'} />
              <StatRow label={t('productView.brand')} value={product?.brandName ?? '-'} />
              <StatRow label={t('productView.colors')} value={product?.colorCodes?.join(', ') || '-'} />
              <StatRow label={t('productView.materials')} value={product?.materialNames?.join(', ') || '-'} />
            </div>
          </Card>

          <Card header={<Heading level="h3">{t('productView.meta')}</Heading>}>
            <div className={styles.cardBodyGrid}>
              <StatRow label={t('productView.created')} value={formatDate(product?.createdAt)} />
              <StatRow label={t('productView.updated')} value={formatDate(product?.updatedAt)} />
            </div>
          </Card>
        </div>

        {/* Image gallery */}
        {product?.images && product.images.length > 0 && (
          <Card header={<Heading level="h3">{t('productView.images')}</Heading>}>
            <div className={styles.imagesGrid}>
              {product.images.map((src, idx) => (
                <img
                  key={`${src}-${idx}`}
                  src={src}
                  alt={`${t('productView.images')} ${idx + 1}`}
                  className={styles.thumb}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Descriptions */}
        {(product?.shortDescription || product?.description) && (
          <Card header={<Heading level="h3">{t('productView.content')}</Heading>}>
            <div className={styles.contentTextGrid}>
              {product?.shortDescription && (
                <Card header={<Heading level="h4">{t('productView.shortDescription')}</Heading>}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{product.shortDescription}</div>
                </Card>
              )}
              {product?.description && (
                <Card header={<Heading level="h4">{t('productView.description')}</Heading>}>
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
