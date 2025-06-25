import React from 'react';
import Flex from '../Flex/Flex';
import { Divider } from '../Divider/Divider';
import styles from './order-summary.module.scss';
import { calculateOrderSummary } from '../../../util/order.utils.ts';
import type { CartItem } from './OrderSummary.tsx';
import clsx from 'clsx';

interface TotalAmountSectionProps {
  items: CartItem[];
  shipping: number;
  currency: string;
}

export const TotalAmountSection: React.FC<TotalAmountSectionProps> = ({
  items,
  shipping,
  currency,
}) => {
  const { subtotal, total } = calculateOrderSummary(items, shipping);

  return (
    <Flex direction="vertical" spacing="xl">
      <Flex justify="between" fullWidth>
        <span>Subtotal</span>
        <span>
          {currency}
          {subtotal}
        </span>
      </Flex>
      <Flex justify="between" fullWidth>
        <span>Shipping</span>
        <span>
          {currency}
          {shipping.toFixed(2)}
        </span>
      </Flex>
      <Divider />
      <Flex justify="between" className={clsx('bts-marginTl', styles.orderSummaryTotal)} fullWidth>
        <span>Total</span>
        <span>
          {currency}
          {total}
        </span>
      </Flex>
    </Flex>
  );
};
