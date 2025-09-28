import React from 'react';
import styles from './cart-item-card.module.scss';
import clsx from 'clsx';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Flex } from '@baby-toys/ui-kit';
import CartQuantityInput from '../../shared/CartQuantityInput';
import { useRemoveFromCart } from '../../../api/cartApi.ts';

interface CartItemCardProps {
  image: string;
  name: string;
  id: string;
  totalPrice: number;
  quantityInStock: number;
  quantity: number;
  fullWidth?: boolean;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  image,
  name,
  totalPrice,
  quantity,
  fullWidth,
  quantityInStock,
  id,
}) => {
  const removeMutation = useRemoveFromCart();

  return (
    <div className={clsx(fullWidth && styles.fullWidth, styles.cartItemCard)}>
      <img src={image} alt={name} className={styles.cartItemCardImage} />
      <span className={styles.cartItemCardName}>{name}</span>
      <Flex spacing="xs" align="center" className={styles.cartItemCardAmount}>
        <CartQuantityInput
          itemId={Number(id)}
          availableInStock={quantityInStock}
          quantity={quantity}
          fullWidth
        />
        <Button
          leftIcon={faTrashAlt}
          appearance="link"
          color="secondary"
          onClick={() => removeMutation.mutate({ itemId: Number(id) })}
          isLoading={removeMutation.isPending}
        ></Button>
      </Flex>
      <span className={styles.cartItemCardPrice}>{totalPrice}</span>
    </div>
  );
};

export default CartItemCard;
