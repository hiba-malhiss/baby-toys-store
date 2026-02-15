import React from 'react';
import styles from './cart-item-card.module.scss';
import clsx from 'clsx';
import { Trash2 } from 'lucide-react';
import { Button, Flex, Image, Text } from '@baby-toys/ui-kit';
import CartQuantityInput from '../../shared/CartQuantityInput';
import { useRemoveFromCart } from '../../../api/cartApi.ts';
import { useTranslation } from 'react-i18next';

export type CartItemAppearance = 'default' | 'compact';

interface CartItemCardProps {
  image: string;
  name: string;
  id: string;
  totalPrice: string | number;
  quantityInStock: number;
  quantity: number;
  variantOptions: string[];
  fullWidth?: boolean;
  appearance?: CartItemAppearance;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  image,
  name,
  totalPrice,
  quantity,
  fullWidth,
  quantityInStock,
  id,
  variantOptions,
  appearance = 'default',
}) => {
  const removeMutation = useRemoveFromCart();
  const { t } = useTranslation('common');

  const isOutOfStock = quantityInStock <= 0;

  return (
    <div
      className={clsx(
        styles.cartItemCard,
        appearance === 'compact' ? styles.cartItemCardCompact : styles.cartItemCardDefault,
        fullWidth && styles.fullWidth
      )}
    >
      <Image src={image} alt={name} className={styles['cartItemCard-image']} />

      <Flex direction="vertical">
        <span className={styles['cartItemCard-name']}>{name}</span>
        {variantOptions?.length > 0 && (
          <Text size={appearance === 'compact' ? 'xs' : 'xs'} color="secondary">
            {variantOptions.join(', ')}
          </Text>
        )}
        {appearance === 'compact' && <div className="bts-paddingTs">x{quantity}</div>}
        {!isOutOfStock && quantity > quantityInStock && appearance !== 'compact' && (
          <Text size="sm" color="warning">
            {t('cart.reduceToStock', { count: quantityInStock })}
          </Text>
        )}
        {isOutOfStock && appearance !== 'compact' && (
          <Text size="xs" color="error">
            {t('cart.outOfStock')}
          </Text>
        )}
      </Flex>

      {appearance !== 'compact' && (
        <Flex spacing="xs" align="center" className={styles['cartItemCard-amount']}>
          <CartQuantityInput
            itemId={Number(id)}
            availableInStock={quantityInStock}
            quantity={quantity}
            fullWidth
            isDisabled={isOutOfStock}
            size="small"
          />
          <Button
            leftIconComp={Trash2}
            appearance="link"
            color="secondary"
            onClick={() => removeMutation.mutate({ itemId: Number(id) })}
            isLoading={removeMutation.isPending}
          />
        </Flex>
      )}

      <span className={clsx(styles['cartItemCard-price'], isOutOfStock && styles.oosPrice)}>
        {totalPrice}
      </span>
    </div>
  );
};

export default CartItemCard;
