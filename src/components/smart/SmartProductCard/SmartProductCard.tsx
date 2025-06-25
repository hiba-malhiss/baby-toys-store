import ProductCard, { type ProductCardProps } from '../../common/ProductCard/ProductCard.tsx';
import { useCartStore } from '../../../store/useCartStore.ts';
import { useFavoritesStore } from '../../../store/useFavoritesStore.ts';
import { useNavigate } from 'react-router-dom';

const SmartProductCard: React.FC<ProductCardProps> = (props) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  return (
    <ProductCard
      {...props}
      onAddToCart={(product) => addToCart(product)}
      onToggleFavorite={(product) => toggleFavorite(product.id)}
      isFavorite={isFavorite(props.product.id)}
      onClick={(product) => navigate(`/product-details/${product.id}`)}
    />
  );
};

export default SmartProductCard;
