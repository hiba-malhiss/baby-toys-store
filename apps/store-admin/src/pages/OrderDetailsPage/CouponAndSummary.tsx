import React from 'react';
import styles from './order-details-page.module.scss';
import { Check, Trash2 } from 'lucide-react';
import { Button, Card, Flex, StringInput } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';
import { Order } from '../../api/types/order.ts';

export const CouponAndSummary: React.FC<{
  isEdit: boolean;
  couponInput: string;
  setCouponInput: (v: string) => void;
  order: Order;
  currency: any;
  handleApplyCoupon: () => void;
  handleRemoveCoupon: () => void;
  canEditOrder: boolean;
}> = ({
  isEdit,
  couponInput,
  setCouponInput,
  order,
  currency,
  handleApplyCoupon,
  handleRemoveCoupon,
  canEditOrder,
}) => {
  const { t } = useTranslation();

  return (
    <Card header={t('couponSummary.title')} fullWidth className={styles.orderDetailsCardDelay1}>
      <Flex spacing="xl" direction="vertical" align="stretch">
        {isEdit && (
          <Flex spacing="s" align="center" className={styles.orderDetailsCouponRow}>
            <StringInput
              placeholder={t('couponSummary.couponPlaceholder')}
              value={couponInput}
              onChange={setCouponInput}
              isDisabled={!canEditOrder}
            />
            <Button
              onClick={handleApplyCoupon}
              leftIconComp={Check}
              isDisabled={!couponInput.trim() || !canEditOrder}
            />
            {order?.couponCode && (
              <Button
                appearance="outline"
                color="error"
                onClick={handleRemoveCoupon}
                leftIconComp={Trash2}
                isDisabled={!canEditOrder}
              />
            )}
          </Flex>
        )}

        {order?.couponCode ? (
          <div className={styles.orderDetailsCouponApplied}>
            <div>
              <div className={styles.orderDetailsCouponAppliedLabel}>
                {t('couponSummary.couponApplied')}
              </div>
              <span className={styles.couponCode}>{order.couponCode}</span>
            </div>
          </div>
        ) : (
          <span className={styles.orderDetailsNoCoupon}>{t('couponSummary.noCoupon')}</span>
        )}

        <Flex spacing="s" justify="between" className={styles.orderDetailsSummaryLine}>
          <strong>{t('couponSummary.subtotal')}:</strong>
          <span>
            {order?.subtotal} {currency?.symbol}
          </span>
        </Flex>

        <Flex spacing="s" justify="between" className={styles.orderDetailsSummaryLine}>
          <strong>{t('couponSummary.shipping')}:</strong>
          <span>
            {order?.shippingCost} {currency?.symbol}
          </span>
        </Flex>

        <Flex spacing="s" justify="between" className={styles.orderDetailsSummaryLine}>
          <strong>{t('couponSummary.discount')}:</strong>
          <span className={styles.orderDetailsDiscount}>
            − {order?.discountAmount} {currency?.symbol}
          </span>
        </Flex>

        <Flex spacing="s" justify="between" className={styles.orderDetailsTotalSummary}>
          <strong>{t('couponSummary.total')}:</strong>
          <span>
            {order?.totalWithShipping} {currency?.symbol}
          </span>
        </Flex>
      </Flex>
    </Card>
  );
};
