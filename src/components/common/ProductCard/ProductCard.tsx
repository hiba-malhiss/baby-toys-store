import React, { useCallback } from 'react';
import styles from './product-card.module.scss';
import Chip from '../Chip/Chip';
import Rating from '../Rating/Rating';
import { faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import type { Product } from '../../../types/product.types.ts';
import Card from '../Card/Card.tsx';
import { Button } from '../Button/Button.tsx';
import Flex from '../Flex/Flex.tsx';

export type ProductCardProps = {
  direction?: 'horizontal' | 'vertical';
  size?: 'small';
  product: Product;
  fullWidth?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
  onClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  size,
  product,
  onToggleFavorite,
  onAddToCart,
  direction = 'vertical',
  onClick,
  fullWidth,
  isFavorite,
}) => {
  const isHorizontal = direction === 'horizontal';
  const isSmallSize = size === 'small';

  const handleButtonClick = useCallback((e: MouseEvent, handler?: (product: Product) => void) => {
    e.preventDefault();
    e.stopPropagation();
    handler?.(product);
  }, []);

  const renderButtons = () => (
    <Flex
      className={styles.productCardButtons}
      spacing={direction === 'vertical' ? 'none' : 'xl'}
      align="center"
      direction={direction}
    >
      {direction === 'vertical' && (
        <Button
          leftIcon={faCartShopping}
          appearance="link"
          color="secondary"
          size="xlarge"
          onClick={(e) => handleButtonClick(e, onAddToCart)}
          aria-label="Add to cart"
        />
      )}
      {direction === 'horizontal' && (
        <Button
          leftIcon={faCartShopping}
          size="large"
          onClick={(e) => handleButtonClick(e, onAddToCart)}
        >
          Add to cart
        </Button>
      )}
      <Button
        leftIcon={faHeart}
        appearance={isHorizontal ? 'outline' : 'link'}
        color="icon"
        size="xlarge"
        isSelected={isFavorite}
        onClick={(e) => handleButtonClick(e, onToggleFavorite)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      />
    </Flex>
  );

  return (
    <div
      className={clsx(
        styles.productCard,
        fullWidth && styles.fullWidth,
        styles[`productCard--${direction}`],
        isSmallSize && styles.productCardSmall
      )}
      onClick={() => onClick?.(product)}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(product);
        }
      }}
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
        <div
          className={clsx(
            product.oldPrice && styles.productCardWithDiscount,
            styles.productCardPrice
          )}
        >
          <span className={styles.productCardInfoPriceNew}>{product.price + product.currency}</span>
          {product.oldPrice && (
            <span className={styles.productCardInfoPriceOld}>
              {product.oldPrice + product.currency}
            </span>
          )}
        </div>
        <Rating value={product.rating} className={styles.productCardRating} />
        {isHorizontal && !isSmallSize && renderButtons()}
      </div>
    </div>
  );
};

export default ProductCard;
