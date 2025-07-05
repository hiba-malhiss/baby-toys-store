import { formatDate } from '../../../util/format.utils';
import Card from '../../../components/common/Card/Card.tsx';
import { Button } from '../../../components/common/Button/Button.tsx';
import styles from './order-product-card.module.scss';
import type { CartItem, OrderItem } from '../../../types/product.types.ts';
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter';
import { useNavigate } from 'react-router-dom';

interface OrderProductCardProps {
  onBuyAgain: (cartItem: CartItem) => void;
  onAddReview: (cartItem: CartItem) => void;
  order: OrderItem;
}

const OrderProductCard = ({ order, onBuyAgain, onAddReview }: OrderProductCardProps) => {
  const formatCurrency = useCurrencyFormatter();
  const navigate = useNavigate();

  return (
    <Card fullWidth size="small" className={styles.orderCard}>
      <header className={styles.orderCardHeader}>
        <div>Order #{order.id}</div>
        <div>{formatDate(order.date)}</div>
      </header>

      <div>
        {order.cartItems.map((item) => (
          <div key={item.productId} className={styles.orderCardCartItem}>
            <img
              src={item.product.mainImage}
              alt={item.product.name}
              className={styles.orderCardCartItemImage}
            />
            <div className={styles.orderCardCartItemInfo}>
              <Button
                withoutPadding
                appearance="link"
                className={styles.orderCardCartItemName}
                onClick={() => navigate('/product-details/' + item.productId)}
              >
                {item.product.name}
              </Button>
              <div className={styles.orderCardCartItemQuantity}>X{item.quantity}</div>
            </div>
            <div className={styles.orderCardCartItemPrice}>
              {formatCurrency(item.product.price * item.quantity)}
            </div>
            <div className={styles.orderCardCartItemActions}>
              <Button
                color="secondary-light"
                onClick={() => onBuyAgain(item)}
                aria-label={`Buy again ${item.product.name}`}
              >
                Buy Again
              </Button>
              <Button
                onClick={() => onAddReview(item)}
                aria-label={`Add review for ${item.product.name}`}
              >
                Add Review
              </Button>
            </div>
          </div>
        ))}
      </div>

      <footer className={styles.orderCardFooter}>
        <div>Subtotal: {formatCurrency(order.subtotal)}</div>
        <div>Shipping: {formatCurrency(order.shippingCost)}</div>
        <div>Total: {formatCurrency(order.total)}</div>
      </footer>
    </Card>
  );
};

export default OrderProductCard;
