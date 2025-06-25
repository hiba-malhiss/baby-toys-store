import React, { useState } from 'react';
import styles from './order-summary.module.scss';
import Flex from '../Flex/Flex';
import CartItemCard from '../CartItemCard/CartItemCard';
import { Divider } from '../Divider/Divider';
import { TotalAmountSection } from './TotalAmountSection';
import type { CartItem } from '../../../types/product.types.ts';

interface OrderSummaryProps {
  items: CartItem[];
  shipping: number;
  currency: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, shipping, currency }) => {
  const [quantities, setQuantities] = useState<number[]>(items.map((item) => item.quantity));

  const handleAmountChange = (index: number, newVal: string) => {
    const updated = [...quantities];
    updated[index] = Math.max(parseInt(newVal) || 1, 1);
    setQuantities(updated);
  };

  return (
    <div className={styles.orderSummary}>
      <Flex direction="vertical" spacing="xxl" fullWidth>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <CartItemCard
              key={item.productId}
              image={item.mainImage}
              name={item.name}
              price={item.price}
              quantity={quantities[index]}
              onAmountChange={(val) => handleAmountChange(index, val)}
            />
            <Divider />
          </React.Fragment>
        ))}
        <TotalAmountSection items={items} shipping={shipping} currency={currency} />
      </Flex>
    </div>
  );
};

export default OrderSummary;
