import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard, type ProductCardProps } from '@baby-toys/ui-kit';
import { useWishlist } from '../../../hooks/useWishlist.ts';
import { useAddToCart } from '../../../api/cartApi';
import { useCartStore } from '../../../store/useCartStore';
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter.ts';

type SmartProductCardProps = ProductCardProps;

const SmartProductCard: React.FC<SmartProductCardProps> = ({ ...props }) => {
  const navigate = useNavigate();
  const { isFavorite, isLoading, toggleFavorite } = useWishlist(props.product);
  const addToCartMutation = useAddToCart();
  const { openShippingCartDrawer } = useCartStore();
  const formatCurrency = useCurrencyFormatter();
  const handleToggleFavorite = async () => {
    await toggleFavorite();
  };

  return (
    <ProductCard
      {...props}
      label={props.product.oldPrice > props.product.price ? 'SALE' : ''}
      formatCurrency={formatCurrency}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
      isLoadingAddToCart={addToCartMutation.isPending}
      onAddToCart={async (product) => {
        await addToCartMutation.mutateAsync({ productId: Number(product.id), quantity: 1 });
        openShippingCartDrawer();
      }}
      isLoadingFavorite={isLoading}
      onClick={(product) => navigate(`/product-details/${product.id}`)}
    />
  );
};

export default SmartProductCard;
