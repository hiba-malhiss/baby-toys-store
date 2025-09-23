import React from 'react';
import styles from './order-details-page.module.scss';
import { faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Flex, Heading, StringInput } from '@baby-toys/ui-kit/components';

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
}) => (
  <Card header={<Heading level="h3">Coupon & Summary</Heading>}>
    <Flex spacing="xl" direction="vertical">
      {isEdit && (
        <Flex spacing="s" align="center" className={styles.couponRow}>
          <StringInput
            placeholder="Coupon code"
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
          <span>Coupon Applied:</span>
          <span className={styles.couponCode}>{order.couponCode}</span>
        </Flex>
      ) : (
        <span className={styles.orderDetailsNoCoupon}>No coupon applied</span>
      )}

      <Flex spacing="s" justify="between">
        <strong>Subtotal:</strong>
        <span>
          {order?.subtotal} {currency?.symbol}
        </span>
      </Flex>
      <Flex spacing="s" justify="between">
        <strong>Discount:</strong>
        <span className={styles.orderDetailsDiscount}>
          - {order?.discountAmount} {currency?.symbol}
        </span>
      </Flex>
      <Flex spacing="s" justify="between" className={styles.orderDetailsTotalSummary}>
        <strong>Total:</strong>
        <span>
          {order?.total} {currency?.symbol}
        </span>
      </Flex>
    </Flex>
  </Card>
);
