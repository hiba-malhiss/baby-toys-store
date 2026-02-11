import React, { useMemo, useCallback } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Heading,
  Chip,
  CopyToClipboardButton,
  Accordion,
  AccordionGroup,
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

  const formatMoney = useCallback(
    (val?: number | null) => (val != null ? `${symbol}${Number(val).toLocaleString()}` : '-'),
    [symbol]
  );

  const formatPercent = useCallback(
    (val?: number | null) => (val != null ? `${(Number(val) * 100).toFixed(2)}%` : '-'),
    []
  );

  const formatDateTime = useCallback((val?: string | null) => {
    return val ? new Date(val).toLocaleString() : '-';
  }, []);

  const vm = useMemo(() => {
    const name = product?.name || t('productView.fallbackName');

    const inventoryRows: KeyValueRow[] = [
      {
        id: 'stock',
        label: t('productView.stock'),
        value: (product as any)?.activeVariantsTotalStock ?? '-',
      },
      { id: 'unitsSold', label: t('productView.unitsSold'), value: product?.sales ?? 0 },
      {
        id: 'releaseDate',
        label: t('productView.releaseDate'),
        value: formatDateTime(product?.releaseDate),
      },
      {
        id: 'active',
        label: t('productView.active'),
        value: product?.isActive ? t('app.yes') : t('app.no'),
      },
    ];

    const pricingRows: KeyValueRow[] = [
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
    ];

    const classificationRows: KeyValueRow[] = [
      { id: 'category', label: t('productView.category'), value: product?.categoryName ?? '-' },
    ];

    const metaRows: KeyValueRow[] = [
      { id: 'created', label: t('productView.created'), value: formatDateTime(product?.createdAt) },
      { id: 'updated', label: t('productView.updated'), value: formatDateTime(product?.updatedAt) },
    ];

    const options = (product as any)?.options || [];
    const attributes = (product as any)?.attributes;
    const variants = ((product as any)?.variants || []) as any[];

    return {
      id: product?.id,
      name,
      mainImage: product?.mainImage,
      categoryName: product?.categoryName,
      isActive: product?.isActive,

      kpis: {
        revenueLifetime: formatMoney(product?.totalRevenue),
        profitLifetime: formatMoney(product?.totalProfit),
        margin: formatPercent(product?.profitMargin),
      },

      inventoryRows,
      pricingRows,
      classificationRows,
      metaRows,

      options,
      attributes,
      variants,

      images: product?.images ?? [],
      shortDescription: product?.shortDescription,
      description: product?.description,
    };
  }, [product, t, formatMoney, formatPercent, formatDateTime]);

  const hasImages = vm.images.length > 0;
  const hasDesc = Boolean(vm.shortDescription || vm.description);

  const detailsRows = useMemo<KeyValueRow[]>(
    () => [...vm.inventoryRows, ...vm.pricingRows, ...vm.classificationRows, ...vm.metaRows],
    [vm.inventoryRows, vm.pricingRows, vm.classificationRows, vm.metaRows]
  );

  return (
    <AdminLayout isLoading={isLoading || !product}>
      <div className={styles.container}>
        {/* Hero */}
        <Card>
          <div className={styles.heroCardGrid}>
            <div className={styles.heroLeftGrid}>
              {vm.mainImage && (
                <img src={vm.mainImage} alt={vm.name} className={styles.mainImage} />
              )}

              <div className={styles.heroText}>
                <Heading level="h3" className={styles.title}>
                  {vm.name}
                </Heading>

                <div className={styles.metaRow}>
                  <span className={styles.fadedId}>{t('productView.idLabel', { id: vm.id })}</span>
                  {vm.id != null && (
                    <CopyToClipboardButton
                      value={vm.id}
                      successMessage={t('productView.productIdCopied')}
                      ariaLabel={t('productView.copyProductId')}
                      appearance="link"
                    />
                  )}
                </div>

                <div className={styles.metaRow}>
                  <span className={styles.faded}>{vm.categoryName || '-'}</span>
                  {vm.isActive === false && (
                    <Chip label={t('productView.inactive')} appearance="error" />
                  )}
                </div>
              </div>
            </div>

            <div className={styles.heroActions}>
              <Button
                leftIconComp={Pencil}
                appearance="outline"
                isDisabled={vm.id == null}
                onClick={() => vm.id != null && navigate(`/edit-product/${vm.id}`)}
              >
                {t('productView.editProduct')}
              </Button>
            </div>
          </div>
        </Card>

        {/* KPIs */}
        <div className={styles.kpiGrid}>
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

        {/* Content / Cards */}
        <div className={styles.contentGrid}>
          <Card>
            <div className={styles.cardHeader}>
              <Heading level="h4">{t('productView.details', { defaultValue: 'Details' })}</Heading>
            </div>
            <div className={styles.cardBody}>
              <KeyValueTable
                rows={detailsRows}
                labelHeader={t('productView.stat', { defaultValue: 'Stat' })}
              />
            </div>
          </Card>

          {hasImages && (
            <Card>
              <div className={styles.cardHeader}>
                <Heading level="h4">{t('productView.images')}</Heading>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.imagesGrid}>
                  {vm.images.map((src, idx) => (
                    <img
                      key={`${src}-${idx}`}
                      src={src}
                      alt={`${t('productView.images')} ${idx + 1}`}
                      className={styles.thumb}
                    />
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {hasDesc && (
          <Card>
            <div className={styles.cardHeader}>
              <Heading level="h4">{t('productView.description')}</Heading>
            </div>

            <div className={styles.cardBody}>
              {vm.shortDescription && (
                <div className={styles.descBlock}>
                  <div className={styles.descTitle}>{t('productView.shortDescription')}</div>
                  <div className={styles.descBox}>{vm.shortDescription}</div>
                </div>
              )}

              {vm.description && (
                <div className={styles.descBlock}>
                  <div className={styles.descTitle}>{t('productView.description')}</div>
                  <div className={styles.descBox}>{vm.description}</div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Heavy sections only */}
        <AccordionGroup allowMultipleOpen fullWidth withDivider>
          <Accordion
            key="variations"
            header={t('productView.variations', { defaultValue: 'Variations' })}
            defaultOpen
          >
            <ProductVariations
              productId={productId as number}
              variants={vm.variants as any}
              readOnly
            />
          </Accordion>

          <Accordion key="options" header={t('productView.options', { defaultValue: 'Options' })}>
            <ProductOptionsTable options={vm.options || []} />
          </Accordion>

          <Accordion
            key="attributes"
            header={t('productView.attributes', { defaultValue: 'Attributes' })}
          >
            <ProductAttributesTable attributes={vm.attributes} />
          </Accordion>
        </AccordionGroup>
      </div>
    </AdminLayout>
  );
};

export default ProductViewPage;
