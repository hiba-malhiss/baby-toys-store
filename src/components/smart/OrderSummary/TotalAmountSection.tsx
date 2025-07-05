import React from 'react';
import styles from './order-summary.module.scss';
import { calculateOrderSummary } from '../../../util/order.utils.ts';
import clsx from 'clsx';
import Flex from '../../common/Flex/Flex.tsx';
import { Divider } from '../../common/Divider/Divider.tsx';
import type { CartItem } from '../../../types/product.types.ts';
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter';

interface TotalAmountSectionProps {
  items: CartItem[];
  shipping: { cost: number; freeThreshold: number };
  currency: string;
  className?: string;
}

export const TotalAmountSection: React.FC<TotalAmountSectionProps> = ({
  items,
  shipping,
  currency,
  className,
}) => {
  const formatCurrency = useCurrencyFormatter(currency);
  const {
    subtotal,
    total,
    shipping: shippingCost,
    isFreeShipping,
  } = calculateOrderSummary(items, shipping);

  return (
    <Flex direction="vertical" spacing="xl" className={className}>
      <Flex justify="between" fullWidth>
        <span>Subtotal</span>
        <span>{formatCurrency(Number(subtotal))}</span>
      </Flex>
      <Flex justify="between" fullWidth className={styles.shippingRow}>
        <span>Shipping</span>
        <span>
          {isFreeShipping ? (
            <span className={styles.freeShippingText}>Free</span>
          ) : (
            <span>{formatCurrency(Number(shippingCost))}</span>
          )}
        </span>
      </Flex>
      {isFreeShipping && (
        <Flex justify="center" fullWidth>
          <span className={styles.freeShippingIndicator}>Free shipping applied!</span>
        </Flex>
      )}
      <Divider />
      <Flex justify="between" className={clsx('bts-marginTl', styles.orderSummaryTotal)} fullWidth>
        <span>Total</span>
        <span>{formatCurrency(Number(total))}</span>
      </Flex>
    </Flex>
  );
};
