import React from 'react';
import styles from './cart-item-card.module.scss';
import clsx from 'clsx';
import { Trash2 } from 'lucide-react';
import { Button, Flex, Image, Text } from '@baby-toys/ui-kit';
import CartQuantityInput from '../../shared/CartQuantityInput';
import { useRemoveFromCart } from '../../../api/cartApi.ts';
import { useTranslation } from 'react-i18next';

interface CartItemCardProps {
  image: string;
  name: string;
  id: string;
  totalPrice: string | number;
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
  const { t } = useTranslation('common');

  return (
    <div className={clsx(fullWidth && styles.fullWidth, styles.cartItemCard)}>
      <Image src={image} alt={name} className={styles.cartItemCardImage} />
      <Flex direction="vertical" spacing="s" className={styles.cartItemCardName}>
        {name}
        {(!quantityInStock || quantityInStock <= 0) && (
          <Text size="sm" color="error" className="bts-marginTs">
            {t('cart.outOfStock')}
          </Text>
        )}
        {quantityInStock > 0 && (quantity ?? 0) > quantityInStock && (
          <Text size="sm" color="warning" className="bts-marginTs">
            {t('cart.reduceToStock', { count: quantityInStock })}
          </Text>
        )}
      </Flex>
      <Flex spacing="xs" align="center" className={styles.cartItemCardAmount}>
        <CartQuantityInput
          itemId={Number(id)}
          availableInStock={quantityInStock}
          quantity={quantity}
          fullWidth
          isDisabled={!quantityInStock || quantityInStock <= 0}
          size="small"
        />
        <Button
          leftIconComp={Trash2}
          appearance="link"
          color="secondary"
          onClick={() => removeMutation.mutate({ itemId: Number(id) })}
          isLoading={removeMutation.isPending}
        ></Button>
      </Flex>
      <span
        className={clsx(
          styles.cartItemCardPrice,
          (!quantityInStock || quantityInStock <= 0) && styles.oosPrice
        )}
      >
        {totalPrice}
      </span>
    </div>
  );
};

export default CartItemCard;
