import React from 'react';
import { Card, Flex } from '@baby-toys/ui-kit';
import styles from './order-details-page.module.scss';
import { useTranslation } from 'react-i18next';
import { Order } from '../../api/types/order.ts';

type Props = {
  order: Order;
  currency: any;
};

export const ProfitCard: React.FC<Props> = ({ order, currency }) => {
  const { t } = useTranslation();

  return (
    <Card
      header={t('couponSummary.profitBreakdown', { defaultValue: 'Profit Breakdown' })}
      fullWidth
      className={styles.orderDetailsCardDelay2}
    >
      <div className={styles.orderDetailsProfitGrid}>
        <div className={styles.orderDetailsProfitKpi}>
          <div className={styles.orderDetailsProfitKpiLabel}>{t('couponSummary.totalCost')}</div>
          <div
            className={`${styles.orderDetailsProfitKpiValue} ${styles.orderDetailsProfitKpiValueCost}`}
          >
            {order?.totalCost} {currency?.symbol}
          </div>
        </div>

        <div className={styles.orderDetailsProfitKpi}>
          <div className={styles.orderDetailsProfitKpiLabel}>{t('couponSummary.totalProfit')}</div>
          <div
            className={`${styles.orderDetailsProfitKpiValue} ${styles.orderDetailsProfitKpiValueProfit}`}
          >
            {order?.totalProfit} {currency?.symbol}
          </div>
        </div>

        <div className={`${styles.orderDetailsProfitKpi} ${styles.orderDetailsProfitKpiWide}`}>
          <div className={styles.orderDetailsProfitKpiLabel}>{t('couponSummary.profitMargin')}</div>
          <div
            className={`${styles.orderDetailsProfitKpiValue} ${styles.orderDetailsProfitKpiValueMargin}`}
          >
            {(Number(order?.profitMargin) * 100).toFixed(2)}%
          </div>
        </div>
      </div>
    </Card>
  );
};
