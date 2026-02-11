import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '@baby-toys/ui-kit';
import { useWishlist } from '../../../hooks/useWishlist.ts';
import { useWishlistIds } from '../../../api/wishlistApi';
import { useAddToCart } from '../../../api/cartApi';
import { useCartStore } from '../../../store/useCartStore';
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter.ts';
import { useToast } from '@baby-toys/ui-kit';
import type { Product } from '../../../api/types/product.ts';

const SmartProductCard: React.FC<{ product: Product }> = ({ ...props }) => {
  const navigate = useNavigate();
  const { isFavorite, isLoading, toggleFavorite } = useWishlist(props.product);
  const addToCartMutation = useAddToCart();
  const { openShippingCartDrawer } = useCartStore();
  const formatCurrency = useCurrencyFormatter();
  const toast = useToast();
  useWishlistIds();
  const handleToggleFavorite = async () => {
    await toggleFavorite();
  };

  const getProductLabel = (p: any): string => {
    if (p?.outOfStock) return 'Out of stock';
    if (p?.oldPrice > p?.price) return 'SALE';
    return '';
  };

  return (
    <ProductCard
      {...props}
      labelAppearance={props.product?.outOfStock ? 'secondary' : 'primary'}
      label={getProductLabel(props.product)}
      formatCurrency={formatCurrency}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
      isLoadingAddToCart={addToCartMutation.isPending}
      onAddToCart={async (product: Product) => {
        if (product?.outOfStock) {
          toast.error('Out of stock');
          return;
        }
        await addToCartMutation.mutateAsync({
          productId: Number(props.product.id),
          variantId: Number(props.product?.defaultVariant?.id),
          quantity: 1,
        });
        openShippingCartDrawer();
      }}
      isLoadingFavorite={isLoading}
      onClick={(product) => navigate(`/product-details/${product.id}`)}
    />
  );
};

export default SmartProductCard;
