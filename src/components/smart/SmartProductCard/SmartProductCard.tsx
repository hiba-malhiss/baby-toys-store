import React from 'react';
import ProductCard, { type ProductCardProps } from '../../common/ProductCard/ProductCard.tsx';
import { useCartStore } from '../../../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/Toast/ToastContext.tsx';
import { useWishlist } from '../../../hooks/useWishlist.ts';

type SmartProductCardProps = ProductCardProps;

const SmartProductCard: React.FC<SmartProductCardProps> = ({ ...props }) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const toast = useToast();
  const { isFavorite, isLoading, toggleFavorite } = useWishlist(props.product);

  const handleToggleFavorite = async () => {
    await toggleFavorite();
  };

  return (
    <ProductCard
      {...props}
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
