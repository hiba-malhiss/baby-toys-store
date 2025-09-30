import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard, useToast, type ProductCardProps } from '@baby-toys/ui-kit';
import { useWishlist } from '../../../hooks/useWishlist.ts';
import { useAddToCart } from '../../../api/cartApi';
import { useAuth } from '../../../context/AuthContext';
import { useLoginDialogStore } from '../../../store/useLoginDialogStore';
import { useCartStore } from '../../../store/useCartStore';
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter.ts';

type SmartProductCardProps = ProductCardProps;

const SmartProductCard: React.FC<SmartProductCardProps> = ({ ...props }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { open: openLoginDialog } = useLoginDialogStore();
  const toast = useToast();
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
        if (!isAuthenticated) {
          toast.info('Please log in to add items to your cart.');
          openLoginDialog();
          return;
        }
        await addToCartMutation.mutateAsync({ productId: Number(product.id), quantity: 1 });
        openShippingCartDrawer();
      }}
      isLoadingFavorite={isLoading}
      onClick={(product) => navigate(`/product-details/${product.id}`)}
    />
  );
};

export default SmartProductCard;
