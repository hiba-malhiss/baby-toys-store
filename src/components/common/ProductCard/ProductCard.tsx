import React from 'react';
import styles from './product-card.module.scss';
import Chip from '../Chip/Chip';
import Rating from '../Rating/Rating';
import { faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import type { Product } from '../../../types/product.types.ts';
import Card from '../Card/Card.tsx';
import { Button } from '../Button/Button.tsx';
import Flex from '../Flex/Flex.tsx';

type ProductCardProps = {
  direction?: 'horizontal' | 'vertical';
  size?: 'small';
  product: Product;
  fullWidth?: boolean;
  onToggleFavorite?: () => void;
  onClick?: (product: Product) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  size,
  product,
  onToggleFavorite,
  direction = 'vertical',
  onClick,
  fullWidth,
}) => {
  const isHorizontal = direction === 'horizontal';
  const isSmallSize = size === 'small';

  const renderButtons = () => (
    <Flex
      className={styles.productCardButtons}
      spacing={direction === 'vertical' ? 'none' : 'xl'}
      align="center"
      direction={direction}
    >
      {direction === 'vertical' && (
        <Button leftIcon={faCartShopping} appearance="link" color="secondary" size="xlarge" />
      )}
      {direction === 'horizontal' && (
        <Button leftIcon={faCartShopping} size="large">
          Add to cart
        </Button>
      )}
      <Button
        leftIcon={faHeart}
        appearance={direction === 'horizontal' ? 'outline' : 'link'}
        color="icon"
        size="xlarge"
        isSelected={product.isFavorite}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite?.();
        }}
      />
    </Flex>
  );

  return (
    <div
      className={clsx(
        styles.productCard,
        fullWidth && styles.fullWidth,
        isHorizontal && styles.productCardHorizontal,
        size === 'small' && styles.productCardSmall
      )}
      onClick={() => onClick?.(product)}
    >
      <Card size="small" className={styles.productCardBox}>
        {product.label && !isSmallSize && (
          <Chip label={product.label} className={styles.productCardChip} />
        )}

        {!isHorizontal && !isSmallSize && renderButtons()}
        <div className={styles.productCardImageWrapper}>
          <img src={product.mainImage} alt={product.name} />
        </div>
      </Card>
      <div className={styles.productCardInfo}>
        <div className={styles.productCardInfoName}>{product.name}</div>
        {isHorizontal && product.description && !isSmallSize && (
          <div className={styles.productCardInfoDescription}>{product.description}</div>
        )}
        <div className={clsx(product.oldPrice && styles.productCardWithDiscount)}>
          <span className={styles.productCardInfoPriceNew}>{product.price + product.currency}</span>
          {product.oldPrice && (
            <span className={styles.productCardInfoPriceOld}>
              {product.oldPrice + product.currency}
            </span>
          )}
        </div>
        <Rating value={product.rating} />
        {isHorizontal && !isSmallSize && renderButtons()}
      </div>
    </div>
  );
};

export default ProductCard;
