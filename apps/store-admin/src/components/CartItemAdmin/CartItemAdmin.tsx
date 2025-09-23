import React from 'react';
import { CartItem } from '@baby-toys/types/src';
import { Flex, Button, ProductQuantityInput } from '@baby-toys/ui-kit';
import styles from './cart-item-admin.module.scss';
import clsx from 'clsx';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAdminStoreConfiguration } from '../../context/StoreConfigurationContext.tsx';

interface CartItemAdminProps {
  item: CartItem;
  isEdit?: boolean;
  onQuantityChange?: (itemId: number, quantity: number) => void;
  onDeleteItem?: (itemId: number) => void;
}

const CartItemAdmin: React.FC<CartItemAdminProps> = ({
  item,
  isEdit,
  onQuantityChange,
  onDeleteItem,
}) => {
  const navigate = useNavigate();
  const { currency } = useAdminStoreConfiguration();

  return (
    <div className={clsx(styles.cartItemCard)}>
      <img
        src={item.product.mainImage}
        alt={item.product.name}
        className={styles.cartItemCardImage}
      />
      <Button
        appearance="link"
        withoutPadding
        onClick={() => navigate(`/products/${item.product.id}`)} //navigate to store front product details page?
      >
        <span className={styles.cartItemCardName}>{item.product.name}</span>
      </Button>
      <Flex spacing="xs" align="center" className={styles.cartItemCardAmount}>
        {isEdit ? (
          <ProductQuantityInput
            quantity={item.quantity}
            availableInStock={item.product.availableInStock}
            onChange={(value) => onQuantityChange?.(item.id, parseInt(value, 10))}
          ></ProductQuantityInput>
        ) : (
          <div>X {item.quantity}</div>
        )}
        {isEdit && (
          <Button
            leftIcon={faTrashAlt}
            appearance="link"
            color="secondary"
            onClick={() => onDeleteItem?.(item.id)}
          ></Button>
        )}
      </Flex>
      <span className={styles.cartItemCardPrice}>
        {item.product.price * item.quantity}
        {currency?.symbol}
      </span>
    </div>
  );
};

export default CartItemAdmin;
