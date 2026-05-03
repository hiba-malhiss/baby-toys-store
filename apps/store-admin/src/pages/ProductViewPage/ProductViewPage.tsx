import React, { useMemo, useCallback, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Heading,
  Chip,
  CopyToClipboardButton,
  Divider,
  TabBar,
  TabBarItem,
  ProductImageGallery,
} from '@baby-toys/ui-kit';
import { Pencil } from 'lucide-react';
import { useProduct } from '../../api/productApi';
import { useStoreSettings } from '../../api/settingsApi';
import styles from './product-view-page.module.scss';
import KPIWithTooltip from '../../components/KPIWithTooltip/KPIWithTooltip';
import { useTranslation } from 'react-i18next';
import ProductVariations from '../ProductVariationsPage/ProductVariations.tsx';
import ProductAttributesTable from './ProductAttributesTable.tsx';
import ProductOptionsTable from './ProductOptionsTable.tsx';
import KeyValueTable, { type KeyValueRow } from './KeyValueTable';

const ProductViewPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : undefined;

  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(productId);
  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol || '';

  const [activeTab, setActiveTab] = useState('variations');

  const formatMoney = useCallback(
    (val?: number | null) => (val != null ? `${symbol}${Number(val).toLocaleString()}` : '-'),
    [symbol]
  );

  const formatPercent = useCallback(
    (val?: number | null) => (val != null ? `${(Number(val) * 100).toFixed(2)}%` : '-'),
    []
  );

  const formatDateTime = useCallback(
    (val?: string | null) => (val ? new Date(val).toLocaleString() : '-'),
    []
  );

  const vm = useMemo(() => {
    const name = product?.name || t('productView.fallbackName');

    const quickFacts: KeyValueRow[] = [
      { id: 'category', label: t('productView.category'), value: product?.categoryName ?? '-' },
      {
        id: 'stock',
        label: t('productView.stock'),
        value: (product as any)?.activeVariantsTotalStock ?? '-',
      },
      { id: 'unitsSold', label: t('productView.unitsSold'), value: product?.sales ?? 0 },
      {
        id: 'fromPrice',
        label: t('productView.fromPrice', { defaultValue: 'From price' }),
        value: formatMoney((product as any)?.defaultVariant?.price),
      },
      {
        id: 'wasPrice',
        label: t('productView.wasPrice', { defaultValue: 'Was price' }),
        value: formatMoney((product as any)?.defaultVariant?.oldPrice),
      },
      {
        id: 'releaseDate',
        label: t('productView.releaseDate'),
        value: formatDateTime(product?.releaseDate),
      },
      { id: 'created', label: t('productView.created'), value: formatDateTime(product?.createdAt) },
      { id: 'updated', label: t('productView.updated'), value: formatDateTime(product?.updatedAt) },
    ];

    const rawImages: string[] = (product as any)?.images ?? [];
    const mainImage: string | undefined = product?.mainImage ?? undefined;

    const allImages = mainImage
      ? [mainImage, ...rawImages.filter((img) => img !== mainImage)]
      : rawImages;

    return {
      id: product?.id,
      name,
      isActive: product?.isActive,
      kpis: {
        revenueLifetime: formatMoney(product?.totalRevenue),
        profitLifetime: formatMoney(product?.totalProfit),
        margin: formatPercent(product?.profitMargin),
      },
      quickFacts,
      options: (product as any)?.options || [],
      attributes: (product as any)?.attributes,
      variants: ((product as any)?.variants || []) as any[],
      allImages,
      shortDescription: product?.shortDescription,
      description: product?.description,
    };
  }, [product, t, formatMoney, formatPercent, formatDateTime]);

  const hasImages = vm.allImages.length > 0;
  const hasDesc = Boolean(vm.shortDescription || vm.description);

  const tabs = [
    { value: 'variations', header: t('productView.variations', { defaultValue: 'Variations' }) },
    { value: 'options', header: t('productView.options', { defaultValue: 'Options' }) },
    { value: 'attributes', header: t('productView.attributes', { defaultValue: 'Attributes' }) },
    ...(hasDesc ? [{ value: 'description', header: t('productView.description') }] : []),
  ];

  return (
    <AdminLayout isLoading={isLoading || !product}>
      <div className={styles.page}>
        {/* ─── HEADER ───────────────────────────── */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <Heading level="h3" className={styles.pageTitle}>
              {vm.name}
            </Heading>

            <div className={styles.pageHeaderMeta}>
              <span className={styles.fadedId}>{t('productView.idLabel', { id: vm.id })}</span>

              {vm.id != null && (
                <CopyToClipboardButton
                  value={vm.id}
                  successMessage={t('productView.productIdCopied')}
                  ariaLabel={t('productView.copyProductId')}
                  appearance="link"
                />
              )}

              {vm.isActive === false && (
                <Chip label={t('productView.inactive')} appearance="error" />
              )}
            </div>
          </div>

          <Button
            leftIconComp={Pencil}
            isDisabled={vm.id == null}
            onClick={() => vm.id != null && navigate(`/edit-product/${vm.id}`)}
          >
            {t('productView.editProduct')}
          </Button>
        </div>

        {/* ─── KPIs ─────────────────────────────── */}
        <div className={styles.kpiStrip}>
          <KPIWithTooltip
            label={t('productView.revenueLifetime')}
            tooltip={t('tooltips.productKPIs.revenueLifetime')}
            value={vm.kpis.revenueLifetime}
          />
          <KPIWithTooltip
            label={t('productView.profitLifetime')}
            tooltip={t('tooltips.productKPIs.profitLifetime')}
            value={vm.kpis.profitLifetime}
          />
          <KPIWithTooltip
            label={t('productView.margin')}
            tooltip={t('tooltips.productKPIs.margin')}
            value={vm.kpis.margin}
          />
        </div>

        {/* ─── TOP SECTION (Gallery + Details) ─── */}
        <div className={styles.topGrid}>
          {hasImages && (
            <Card className={styles.galleryCard}>
              <ProductImageGallery
                images={vm.allImages}
                productName={vm.name}
                showThumbnails
                showArrows
                showDots
              />
            </Card>
          )}

          <Card>
            <p className={styles.cardLabel}>
              {t('productView.details', { defaultValue: 'Details' })}
            </p>

            <KeyValueTable
              rows={vm.quickFacts}
              labelHeader={t('productView.stat', { defaultValue: 'Stat' })}
            />
          </Card>
        </div>

        {/* ─── TABS FULL WIDTH ─── */}
        <Card className={styles.tabCard}>
          <TabBar fullWidth value={activeTab} onChange={setActiveTab} tabs={tabs}>
            <TabBarItem value="variations">
              <div className={styles.tabPanel}>
                <ProductVariations
                  productId={productId as number}
                  variants={vm.variants}
                  readOnly
                />
              </div>
            </TabBarItem>

            <TabBarItem value="options">
              <div className={styles.tabPanel}>
                <ProductOptionsTable options={vm.options || []} />
              </div>
            </TabBarItem>

            <TabBarItem value="attributes">
              <div className={styles.tabPanel}>
                <ProductAttributesTable attributes={vm.attributes} />
              </div>
            </TabBarItem>

            {hasDesc && (
              <TabBarItem value="description">
                <div className={styles.tabPanel}>
                  {vm.shortDescription && (
                    <div className={styles.descBlock}>
                      <p className={styles.descLabel}>{t('productView.shortDescription')}</p>
                      <div className={styles.descBox}>{vm.shortDescription}</div>
                    </div>
                  )}

                  {vm.shortDescription && vm.description && <Divider className="bts-marginVl" />}

                  {vm.description && (
                    <div className={styles.descBlock}>
                      <p className={styles.descLabel}>{t('productView.description')}</p>
                      <div className={styles.descBox}>{vm.description}</div>
                    </div>
                  )}
                </div>
              </TabBarItem>
            )}
          </TabBar>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ProductViewPage;
