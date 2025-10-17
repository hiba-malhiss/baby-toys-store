import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Text, Image, Button, VStack, Spinner } from '@gluestack-ui/themed';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart as faHeartSolid, faCartShopping, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { tokens } from '@pwn/theme';
import { styles } from './productCardStyles';

type ProductCard = {
  id: string | number;
  name: string;
  shortDescription?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  label?: string;
  mainImage: string;
  isFavorite?: boolean;
  availableInStock?: number;
};

type ProductCardProps = {
  product: ProductCard;
  direction?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
  isFavorite?: boolean;
  isLoadingFavorite?: boolean;
  isLoadingAddToCart?: boolean;
  onAddToCart?: (product: ProductCard) => void;
  onToggleFavorite?: (product: ProductCard) => void;
  onClick?: (product: ProductCard) => void;
};

export const ProductCard = ({
                              product,
                              direction = 'vertical',
                              fullWidth,
                              isFavorite,
                              isLoadingFavorite,
                              isLoadingAddToCart,
                              onAddToCart,
                              onToggleFavorite,
                              onClick,
                            }: ProductCardProps) => {
  const isHorizontal = direction === 'horizontal';
  const isOutOfStock = (product.availableInStock ?? 0) === 0;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onClick?.(product)}
      style={[
        styles.card,
        fullWidth && styles.fullWidth,
        isHorizontal && styles.horizontalCard,
      ]}
    >
      <Box style={styles.imageContainer}>
        <Image
          source={{ uri: product.mainImage }}
          alt={product.name}
          style={styles.image}
          resizeMode="contain"
        />
        <Box style={styles.topRightButtons}>
          <Button
            size="xs"
            variant="link"
            onPress={() => onAddToCart?.(product)}
            isDisabled={isOutOfStock}
            accessibilityLabel="Add to cart"
          >
            {isLoadingAddToCart ? (
              <Spinner size="small" />
            ) : (
              <FontAwesomeIcon icon={faCartShopping} size={14} color={tokens.colors.textPrimary} />
            )}
          </Button>
          <Button
            size="xs"
            variant="link"
            onPress={() => onToggleFavorite?.(product)}
            accessibilityLabel="Toggle favorite"
            style={{ marginLeft: 8 }}
          >
            {isLoadingFavorite ? (
              <Spinner size="small" />
            ) : (
              <FontAwesomeIcon
                icon={isFavorite ? faHeartSolid : faHeartRegular}
                size={14}
                color={isFavorite ? tokens.colors.error : tokens.colors.iconMuted}
              />
            )}
          </Button>
          <Button size="xs" variant="link" accessibilityLabel="Refresh" style={{ marginLeft: 8 }}>
            <FontAwesomeIcon icon={faArrowsRotate} size={14} color={tokens.colors.iconMuted} />
          </Button>
        </Box>
      </Box>

      <VStack style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        {isHorizontal && !!product.shortDescription && (
          <Text style={styles.description} numberOfLines={3}>
            {product.shortDescription}
          </Text>
        )}
      </VStack>
    </TouchableOpacity>
  );
};

export default ProductCard;
