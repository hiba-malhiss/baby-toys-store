import React from 'react';
import styles from './order-details-page.module.scss';
import { faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Divider, Flex, Heading, StringInput } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';

export const CouponAndSummary: React.FC<{
  isEdit: boolean;
  couponInput: string;
  setCouponInput: (v: string) => void;
  order: any;
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
    <Card header={t('couponSummary.title')} fullWidth>
      <Flex spacing="xl" direction="vertical">
        {isEdit && (
          <Flex spacing="s" align="center" className={styles.couponRow}>
            <StringInput
              placeholder={t('couponSummary.couponPlaceholder')}
              value={couponInput}
              onChange={setCouponInput}
              isDisabled={!canEditOrder}
            />
            <Button
              onClick={handleApplyCoupon}
              leftIcon={faCheck}
              isDisabled={!couponInput.trim() || !canEditOrder}
            />
            {order?.couponCode && (
              <Button
                appearance="outline"
                onClick={handleRemoveCoupon}
                leftIcon={faTrashAlt}
                isDisabled={!canEditOrder}
              />
            )}
          </Flex>
        )}

        {order?.couponCode ? (
          <Flex spacing="s" justify="between" className={styles.orderDetailsCouponDetails}>
            <span>{t('couponSummary.couponApplied')}:</span>
            <span className={styles.couponCode}>{order.couponCode}</span>
          </Flex>
        ) : (
          <span className={styles.orderDetailsNoCoupon}>{t('couponSummary.noCoupon')}</span>
        )}

        <Flex spacing="s" justify="between">
          <strong>{t('couponSummary.subtotal')}:</strong>
          <span>
            {order?.subtotal} {currency?.symbol}
          </span>
        </Flex>
        <Flex spacing="s" justify="between">
          <strong>{t('couponSummary.shipping')}:</strong>
          <span>
            {order?.shippingCost} {currency?.symbol}
          </span>
        </Flex>
        <Flex spacing="s" justify="between">
          <strong>{t('couponSummary.discount')}:</strong>
          <span className={styles.orderDetailsDiscount}>
            - {order?.discountAmount} {currency?.symbol}
          </span>
        </Flex>
        <Flex spacing="s" justify="between" className={styles.orderDetailsTotalSummary}>
          <strong>{t('couponSummary.total')}:</strong>
          <span>
            {order?.total} {currency?.symbol}
          </span>
        </Flex>
        <Divider/>
        <Flex spacing="s" justify="between">
          <strong>{t('couponSummary.totalCost')}:</strong>
          <span>
            {order?.totalCost} {currency?.symbol}
          </span>
        </Flex>
        <Flex spacing="s" justify="between">
          <strong>{t('couponSummary.totalProfit')}:</strong>
          <span className={styles.orderDetailsProfit}>
            {order?.totalProfit} {currency?.symbol}
          </span>
        </Flex>
        <Flex spacing="s" justify="between">
          <strong>{t('couponSummary.profitMargin')}:</strong>
          <span>{Number(order?.profitMargin) * 100}%</span>
        </Flex>
      </Flex>
    </Card>
  );
};
