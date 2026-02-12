import React, { useCallback } from 'react';
import styles from './product-card.module.scss';
import Chip from '../Chip/Chip';
import Rating from '../Rating/Rating';
import PriceDisplay from '../PriceDisplay/PriceDisplay';
import { ShoppingCart, ArrowLeftRight } from 'lucide-react';
import clsx from 'clsx';
import Card from '../Card/Card.tsx';
import Button from '../Button/Button.tsx';
import Flex from '../Flex/Flex.tsx';
import Image from '../Image/Image.tsx';
import { copyTextToClipboard } from '../../utils';
import { useToast } from '../Toast/ToastContext.tsx';
import HeartButton from '../HeartButton/HeartButton.tsx';

export type ProductCard = {
  id: string | number;
  name: string;
  shortDescription?: string;
  rating?: number;
  reviewsCount?: number;
  label?: string;
  mainImage?: string;
  isFavorite?: boolean;
  availableInStock?: number;
  defaultVariant: {
    price: number;
    oldPrice?: number;
  }
};
export type ProductCardProps = {
  direction?: 'horizontal' | 'vertical';
  size?: 'small';
  product: ProductCard;
  fullWidth?: boolean;
  label?: string;
  labelAppearance?: string;
  isLoadingFavorite?: boolean;
  isFavorite?: boolean;
  isLoadingAddToCart?: boolean;
  hideMobileCart?: boolean;
  onToggleFavorite?: (product: ProductCard) => void;
  onClick?: (product: ProductCard) => void;
  onAddToCart?: (product: ProductCard) => void;
  formatCurrency?: (amount: number) => string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  size,
  product,
  label,
  labelAppearance,
  onToggleFavorite,
  onAddToCart,
  direction = 'vertical',
  onClick,
  fullWidth,
  isLoadingFavorite,
  isLoadingAddToCart,
  formatCurrency,
  isFavorite,
  hideMobileCart,
}) => {
  const isHorizontal = direction === 'horizontal';
  const isSmallSize = size === 'small';
  const toast = useToast();
  const isOutOfStock =
    (product?.availableInStock ?? 0) === 0 || (product as any)?.outOfStock === true;

  const handleButtonClick = useCallback(
    (e: React.MouseEvent, handler?: (product: ProductCard) => void) => {
      e.preventDefault();
      e.stopPropagation();
      handler?.(product);
    },
    []
  );

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
          leftIconComp={ShoppingCart}
          appearance="link"
          color="secondary"
          size="xlarge"
          onClick={(e) => handleButtonClick(e, onAddToCart)}
          aria-label="Add to cart"
          isLoading={isLoadingAddToCart}
          isDisabled={isOutOfStock}
        />
      )}
      {direction === 'horizontal' && (
        <Button
          leftIconComp={ShoppingCart}
          size="xlarge"
          onClick={(e) => handleButtonClick(e, onAddToCart)}
          isLoading={isLoadingAddToCart}
          isDisabled={isOutOfStock}
        >
          Add to cart
        </Button>
      )}
      <HeartButton
        checked={Boolean(isFavorite)}
        appearance={direction !== 'vertical' ? 'outline' : 'default'}
        isLoading={Boolean(isLoadingFavorite)}
        disabled={Boolean(isLoadingFavorite)}
        size={isHorizontal ? 'medium' : 'small'}
        className={styles.productCardHeart}
        ariaLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        onToggle={(_, event) => {
          if ('stopPropagation' in event) {
            event.stopPropagation();
          }
          onToggleFavorite?.(product);
        }}
      />
      {direction === 'horizontal' && (
        <Button
          leftIconComp={ArrowLeftRight}
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
        {label && !isSmallSize && (
          <Chip label={label} appearance={labelAppearance} className={styles.productCardChip} />
        )}
        {!isHorizontal && !isSmallSize && renderButtons()}
        <div className={styles.productCardImageWrapper}>
          <Image src={product.mainImage} alt={product.name} />
        </div>
      </Card>
      <div className={styles.productCardInfo}>
        <div className={styles.productCardInfoName}>{product.name}</div>
        {isHorizontal && product.shortDescription && !isSmallSize && (
          <div className={styles.productCardInfoDescription}>{product.shortDescription}</div>
        )}
        <PriceDisplay
          className={clsx(styles.productCardPrice)}
          price={product?.defaultVariant?.price}
          oldPrice={product?.defaultVariant?.oldPrice}
          formatCurrency={formatCurrency}
        />
        <Flex justify="between" align="center" className={styles.productCardRating}>
          <Flex align="center" spacing="xs">
            <Rating
              value={(product as any)?.rating ?? (product as any)?.averageRating ?? 0}
              reviewsCount={
                ((product as any)?.reviewsCount ?? (product as any)?.numberOfRatings ?? 0) as number
              }
            />
          </Flex>
          {!hideMobileCart && (
            <Button
              leftIconComp={ShoppingCart}
              onClick={(e) => handleButtonClick(e, onAddToCart)}
              appearance="outline"
              size="medium"
              className={styles.productCardMobileCart}
            />
          )}
        </Flex>

        {isHorizontal && !isSmallSize && renderButtons()}
      </div>
    </div>
  );
};

export default ProductCard;
