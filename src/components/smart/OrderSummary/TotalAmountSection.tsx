import React from 'react';
import styles from './order-summary.module.scss';
import { calculateOrderSummary } from '../../../util/order.utils.ts';
import clsx from 'clsx';
import Flex from '../../common/Flex/Flex.tsx';
import { Divider } from '../../common/Divider/Divider.tsx';
import type { CartItem } from '../../../types/product.types.ts';

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
