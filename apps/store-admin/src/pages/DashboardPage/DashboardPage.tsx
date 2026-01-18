import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, BouncingDotsLoader, KPI, Table } from '@baby-toys/ui-kit';
import KPIWithTooltip from '../../components/KPIWithTooltip/KPIWithTooltip';
import { useAdminDashboard } from '../../api/dashboardApi';
import styles from './dashboard-page.module.scss';
import { useStoreSettings } from '../../api/settingsApi.ts';
import { useTranslation } from 'react-i18next';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useAdminDashboard();
  const { data: settings } = useStoreSettings();
  const currency = { symbol: settings?.general?.currencySymbol } as const;

  return (
    <AdminLayout>
      <Heading className="bts-marginBm">{t('dashboard.title')}</Heading>
      <Heading level="h4" appearance="light" className="bts-marginBxxl">
        {t('dashboard.welcome')}
      </Heading>

      {isLoading && <BouncingDotsLoader className="bts-marginTxxl"/>}
      {!isLoading && data && (
        <>
          {/* Revenue Health KPI Tiles */}
          <div className={styles.kpiGrid}>
            <KPIWithTooltip
              label={t('dashboard.revenueThisMonth')}
              tooltip={t('tooltips.dashboard.revenueThisMonth')}
              value={`${currency.symbol}${data.revenueThisMonth}`}
            />
            <KPIWithTooltip
              label={t('dashboard.momRevenueChange')}
              tooltip={t('tooltips.dashboard.momRevenueChange')}
              value={`${((data.revenueMoMPercent ?? 0) * 100).toFixed(1)}%`}
            />
            <KPI
              label={t('dashboard.averageOrderValue')}
              value={`${currency.symbol}${data.aovThisMonth}`}
            />
            <KPI label={t('dashboard.pendingOrders')} value={data.pendingOrders}/>
          </div>

          <Table
            title={t('dashboard.productConversionFunnel')}
            columns={[
              { header: t('dashboard.table.product'), field: 'name' },
              {
                header: t('dashboard.table.viewToWishlist'),
                field: 'viewToWishlistRate',
                body: (r: any) => `${(r.viewToWishlistRate * 100).toFixed(1)}%`
              },
              {
                header: t('dashboard.table.wishlistToCart'),
                field: 'wishlistToCartRate',
                body: (r: any) => `${(r.wishlistToCartRate * 100).toFixed(1)}%`
              },
              {
                header: t('dashboard.table.cartToPurchase'),
                field: 'cartToPurchaseRate',
                body: (r: any) => `${(r.cartToPurchaseRate * 100).toFixed(1)}%`
              },
            ]}
            data={(data?.productInterest?.funnel ?? []).slice(0, 20)}
          />
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardPage;
