import React from 'react';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import styles from './cart-button.module.scss';
import { Icon } from '../Icon/Icon.tsx';
import { Button } from '../Button/Button.tsx';
import { useNavigate } from 'react-router-dom';

interface CartButtonProps {
  itemCount: number;
}

export const CartButton: React.FC<CartButtonProps> = ({ itemCount }) => {
  const navigate = useNavigate();
  return (
    <Button
      appearance="link"
      size="xlarge"
      withoutPadding
      onClick={() => navigate('/shopping-cart')}
    >
      <div className={styles.cartIcon}>
        <Icon icon={faShoppingCart} color="dark" size="xl" />
        {itemCount > 0 && <span className={styles.cartIconBadge}>{itemCount}</span>}
      </div>
    </Button>
  );
};
