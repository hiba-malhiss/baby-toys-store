import React from 'react';
import styles from './cart-item-card.module.scss';
import clsx from 'clsx';
import { Button } from '../Button/Button.tsx';
import Flex from '../Flex/Flex.tsx';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ProductQuantityInput from '../../shared/ProductQuantityInput/ProductQuantityInput.tsx';

interface CartItemCardProps {
  image: string;
  name: string;
  id: string;
  price: number;
  quantityInStock: number;
  quantity: number;
  fullWidth?: boolean;
  onAmountChange: (val: number) => void;
  onRemove: (id: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  image,
  name,
  price,
  quantity,
  fullWidth,
  onRemove,
  quantityInStock,
  id,
  onAmountChange,
}) => {
  return (
    <div className={clsx(fullWidth && styles.fullWidth, styles.cartItemCard)}>
      <img src={image} alt={name} className={styles.cartItemCardImage} />
      <span className={styles.cartItemCardName}>{name}</span>
      <Flex spacing="xs" align="center" className={styles.cartItemCardAmount}>
        <ProductQuantityInput
          availableInStock={quantityInStock}
          quantity={quantity}
          onChange={onAmountChange}
        ></ProductQuantityInput>
        <Button
          leftIcon={faTrashAlt}
          appearance="link"
          color="secondary"
          onClick={() => onRemove(id)}
        ></Button>
      </Flex>
      <span className={styles.cartItemCardPrice}>{price}</span>
    </div>
  );
};

export default CartItemCard;
