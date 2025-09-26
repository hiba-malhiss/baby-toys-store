import React, { useCallback } from 'react';
import styles from './product-card.module.scss';
import Chip from '../Chip/Chip';
import Rating from '../Rating/Rating';
import { faHeart, faCartShopping, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Card from '../Card/Card.tsx';
import Button from '../Button/Button.tsx';
import Flex from '../Flex/Flex.tsx';
import { copyTextToClipboard } from '../../utils';
import { useToast } from '../Toast/ToastContext.tsx';

export type Product = {
  id: string | number;
  name: string;
  shortDescription?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  label?: string;
  mainImage: string;
  isFavorite?: boolean;
};
export type ProductCardProps = {
  direction?: 'horizontal' | 'vertical';
  size?: 'small';
  product: Product;
  fullWidth?: boolean;
  isLoadingFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
  onClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  formatCurrency?: (amount: number) => string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  size,
  product,
  onToggleFavorite,
  onAddToCart,
  direction = 'vertical',
  onClick,
  fullWidth,
  isLoadingFavorite,
  formatCurrency,
}) => {
  const isHorizontal = direction === 'horizontal';
  const isSmallSize = size === 'small';
  const toast = useToast();

  const handleButtonClick = useCallback((e: MouseEvent, handler?: (product: Product) => void) => {
    e.preventDefault();
    e.stopPropagation();
    handler?.(product);
  }, []);

  const handleCopyUrl = useCallback(() => {
    copyTextToClipboard(`${window.location.origin}/product-details/${product.id}`)
      .then(() => {
        toast.success('Product URL copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy URL.');
      });
  }, [product.id]);

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
        size={isHorizontal ? 'large' : 'xlarge'}
        isSelected={product.isFavorite}
        isLoading={isLoadingFavorite}
        onClick={(e) => handleButtonClick(e, onToggleFavorite)}
        aria-label={product.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      />
      {direction === 'horizontal' && (
        <Button
          leftIcon={faRightLeft}
          appearance="outline"
          size="large"
          onClick={(e) => handleButtonClick(e, handleCopyUrl)}
        ></Button>
      )}
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
        {isHorizontal && product.shortDescription && !isSmallSize && (
          <div className={styles.productCardInfoDescription}>{product.shortDescription}</div>
        )}
        <div
          className={clsx(
            product.oldPrice && styles.productCardWithDiscount,
            styles.productCardPrice
          )}
        >
          <span className={styles.productCardInfoPriceNew}>
            {formatCurrency ? formatCurrency(product.price) : product.price}
          </span>
          {product.oldPrice && (
            <span className={styles.productCardInfoPriceOld}>
              {formatCurrency ? formatCurrency(product.oldPrice) : product.oldPrice}
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
