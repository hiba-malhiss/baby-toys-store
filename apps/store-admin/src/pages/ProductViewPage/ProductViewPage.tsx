import React, { useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Heading,
  KPI,
  Chip,
  CopyToClipboardButton,
  Table,
  Accordion,
  AccordionGroup,
} from '@baby-toys/ui-kit';
import { Pencil } from 'lucide-react';
import { useProduct } from '../../api/productApi';
import { useStoreSettings } from '../../api/settingsApi';
import styles from './product-view-page.module.scss';
import KPIWithTooltip from '../../components/KPIWithTooltip/KPIWithTooltip';
import { useTranslation } from 'react-i18next';

type StatRow = {
  id: string;
  label: string;
  value: React.ReactNode;
};

const StatsTable: React.FC<{ rows: StatRow[] }> = ({ rows }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        header: t('productView.stat', { defaultValue: 'Stat' }),
        field: 'label',
        style: { minWidth: 0 },
        body: (row: StatRow) => <span className={styles.statLabel}>{row.label}</span>,
      },
      {
        header: '',
        field: 'value',
        style: { textAlign: 'right' as const, width: 220 },
        body: (row: StatRow) => <span className={styles.statValue}>{row.value ?? '-'}</span>,
      },
    ],
    []
  );

  return (
    <div className={styles.statsTableWrapper}>
      <Table
        stripedRows
        value={rows}
        columns={columns as any}
        paginator={false}
        rowHover={false}
        stripedRows
        title={undefined}
        emptyMessage=""
        useLocalSortAndFilter={false}
        withoutCard
      />
    </div>
  );
};

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

  const formatDateTime = (val?: string | null) => (val ? new Date(val).toLocaleString() : '-');

  const vm = useMemo(() => {
    const name = product?.name || t('productView.fallbackName');

    return {
      id: product?.id,
      name,
      mainImage: product?.mainImage,
      brandName: product?.brandName,
      categoryName: product?.categoryName,
      isActive: product?.isActive,

      kpis: {
        price: formatMoney(product?.price),
        cost: formatMoney(product?.costPrice),
        revenueLifetime: formatMoney(product?.totalRevenue),
        profitLifetime: formatMoney(product?.totalProfit),
        margin: formatPercent(product?.profitMargin),
      },

      inventoryRows: [
        { id: 'stock', label: t('productView.stock'), value: product?.stockQuantity ?? '-' },
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
      ] as StatRow[],

      pricingRows: [
        { id: 'listPrice', label: t('productView.listPrice'), value: formatMoney(product?.price) },
        {
          id: 'costPrice',
          label: t('productView.costPrice'),
          value: formatMoney(product?.costPrice),
        },
        { id: 'oldPrice', label: t('productView.oldPrice'), value: formatMoney(product?.oldPrice) },
      ] as StatRow[],

      classificationRows: [
        { id: 'category', label: t('productView.category'), value: product?.categoryName ?? '-' },
        { id: 'brand', label: t('productView.brand'), value: product?.brandName ?? '-' },
        {
          id: 'colors',
          label: t('productView.colors'),
          value: product?.colorCodes?.join(', ') || '-',
        },
        {
          id: 'materials',
          label: t('productView.materials'),
          value: product?.materialNames?.join(', ') || '-',
        },
      ] as StatRow[],

      metaRows: [
        {
          id: 'created',
          label: t('productView.created'),
          value: formatDateTime(product?.createdAt),
        },
        {
          id: 'updated',
          label: t('productView.updated'),
          value: formatDateTime(product?.updatedAt),
        },
      ] as StatRow[],

      images: product?.images ?? [],
      shortDescription: product?.shortDescription,
      description: product?.description,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, symbol, t]);

  const hasImages = vm.images.length > 0;
  const hasContent = Boolean(vm.shortDescription || vm.description);

  const accordionItems = useMemo(() => {
    const items: React.ReactElement[] = [];

    items.push(
      <Accordion key="inventory" header={t('productView.inventory')} defaultOpen>
        <StatsTable rows={vm.inventoryRows} />
      </Accordion>
    );

    items.push(
      <Accordion key="pricing" header={t('productView.pricing')} defaultOpen>
        <StatsTable rows={vm.pricingRows} />
      </Accordion>
    );

    if (vm.shortDescription) {
      items.push(
        <Accordion key="short" header={t('productView.shortDescription')}>
          <div className={styles.descBox}>{vm.shortDescription}</div>
        </Accordion>
      );
    }

    if (vm.description) {
      items.push(
        <Accordion key="desc" header={t('productView.description')}>
          <div className={styles.descBox}>{vm.description}</div>
        </Accordion>
      );
    }

    items.push(
      <Accordion key="classification" header={t('productView.classification')}>
        <StatsTable rows={vm.classificationRows} />
      </Accordion>
    );

    items.push(
      <Accordion key="meta" header={t('productView.meta')}>
        <StatsTable rows={vm.metaRows} />
      </Accordion>
    );

    if (hasImages) {
      items.push(
        <Accordion key="images" header={t('productView.images')}>
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
        </Accordion>
      );
    }

    return items;
  }, [
    hasContent,
    hasImages,
    t,
    vm.classificationRows,
    vm.description,
    vm.images,
    vm.inventoryRows,
    vm.metaRows,
    vm.pricingRows,
    vm.shortDescription,
  ]);

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
                <Heading level="h1" className={styles.title}>
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
                  <span className={styles.faded}>
                    {vm.brandName || '-'} • {vm.categoryName || '-'}
                  </span>
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
          <KPI label={t('productView.price')} value={vm.kpis.price} />
          <KPI label={t('productView.cost')} value={vm.kpis.cost} />

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

        {/* Accordions */}
        <AccordionGroup allowMultipleOpen fullWidth withDivider>
          {accordionItems}
        </AccordionGroup>
      </div>
    </AdminLayout>
  );
};

export default ProductViewPage;
