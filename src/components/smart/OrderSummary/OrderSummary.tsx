import React, { useState } from 'react';
import { useStoreConfiguration } from '../../../context/StoreConfigurationContext.tsx';
import styles from './order-summary.module.scss';
import { TotalAmountSection } from './TotalAmountSection';
import type { CartItem } from '../../../types/product.types.ts';
import Flex from '../../common/Flex/Flex.tsx';
import CartItemCard from '../../common/CartItemCard/CartItemCard.tsx';
import { Divider } from '../../common/Divider/Divider.tsx';

interface OrderSummaryProps {
  items: CartItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items }) => {
  const { shipping, currency } = useStoreConfiguration();
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
        {currency && shipping && (
          <TotalAmountSection items={items} shipping={shipping} currency={currency.symbol} />
        )}
      </Flex>
    </div>
  );
};

export default OrderSummary;
