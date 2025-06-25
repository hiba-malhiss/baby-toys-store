import ProductCard, { type ProductCardProps } from '../../common/ProductCard/ProductCard.tsx';
import { useCartStore } from '../../../store/useCartStore.ts';
import { useFavoritesStore } from '../../../store/useFavoritesStore.ts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/Toast/ToastContext.tsx';

const SmartProductCard: React.FC<ProductCardProps> = (props) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const toast = useToast();

  return (
    <ProductCard
      {...props}
      onAddToCart={(product) => {
        addToCart(product);
        toast.success('Added to cart!');
      }}
      onToggleFavorite={(product) => toggleFavorite(product.id)}
      isFavorite={isFavorite(props.product.id)}
      onClick={(product) => navigate(`/product-details/${product.id}`)}
    />
  );
};

export default SmartProductCard;
