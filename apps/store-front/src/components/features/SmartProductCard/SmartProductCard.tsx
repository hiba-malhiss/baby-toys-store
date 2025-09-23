import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard, useToast, type ProductCardProps } from '@baby-toys/ui-kit';
import { useWishlist } from '../../../hooks/useWishlist.ts';
import { useCartStore } from '../../../store/useCartStore.ts';
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter.ts';

type SmartProductCardProps = ProductCardProps;

const SmartProductCard: React.FC<SmartProductCardProps> = ({ ...props }) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const toast = useToast();
  const { isFavorite, isLoading, toggleFavorite } = useWishlist(props.product);
  const formatCurrency = useCurrencyFormatter();
  const handleToggleFavorite = async () => {
    await toggleFavorite();
  };

  return (
    <ProductCard
      {...props}
      formatCurrency={formatCurrency}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
      onAddToCart={(product) => {
        addToCart(product);
        toast.success('Added to cart!');
      }}
      isLoadingFavorite={isLoading}
      onClick={(product) => navigate(`/product-details/${product.id}`)}
    />
  );
};

export default SmartProductCard;
