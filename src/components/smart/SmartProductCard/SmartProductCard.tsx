import React from 'react';
import ProductCard, { type ProductCardProps } from '../../common/ProductCard/ProductCard.tsx';
import { useCartStore } from '../../../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/Toast/ToastContext.tsx';
import { useFavorite } from '../../../hooks/useFavorite';

const SmartProductCard: React.FC<ProductCardProps> = (props) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const toast = useToast();

  const { isFavorite, isLoading, toggleFavorite } = useFavorite(props.product.id);

  return (
    <ProductCard
      {...props}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
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
