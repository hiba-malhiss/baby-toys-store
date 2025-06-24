import React from 'react';
import styles from './cart-item-card.module.scss';
import { StringInput } from '../StringInput/StringInput';
import clsx from 'clsx';

interface CartItemCardProps {
  image: string;
  name: string;
  price: number;
  quantity: number;
  fullWidth?: boolean;
  onAmountChange: (val: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  image,
  name,
  price,
  quantity,
  fullWidth,
  onAmountChange,
}) => {
  return (
    <div className={clsx(fullWidth && styles.fullWidth, styles.cartItemCard)}>
      <img src={image} alt={name} className={styles.cartItemCardImage} />
      <span className={styles.cartItemCardName}>{name}</span>
      <StringInput
        type="number"
        min={1}
        value={quantity}
        withControls
        onChange={onAmountChange}
        className={styles.cartItemCardAmount}
        size="small"
        fullWidth
      />
      <span className={styles.cartItemCardPrice}>${price.toFixed(2)}</span>
    </div>
  );
};

export default CartItemCard;
