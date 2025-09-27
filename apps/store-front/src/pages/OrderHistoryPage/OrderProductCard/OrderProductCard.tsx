import styles from './order-product-card.module.scss';
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@baby-toys/ui-kit/utils';
import { Card, Button, Chip, Image } from '@baby-toys/ui-kit';
import type { CartItem } from '@baby-toys/types';
import type { Order } from '../../../api/ordersApi.ts';

export const statusColorMap: Record<string, string> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'success',
  delivered: 'primary',
};

interface OrderProductCardProps {
  onBuyAgain: (cartItem: CartItem) => void;
  onAddReview: (item: any) => void;
  onCancel?: () => void;
  order: Order;
}

const OrderProductCard = ({ order, onBuyAgain, onAddReview, onCancel }: OrderProductCardProps) => {
  const formatCurrency = useCurrencyFormatter();
  const navigate = useNavigate();

  return (
    <Card fullWidth size="small" className={styles.orderCard}>
      <header className={styles.orderCardHeader}>
        <div>Order #{order.id}</div>
        <div>{formatDate(order.date)}</div>
        <Chip
          label={order.status}
          severity={statusColorMap[order.status]}
          className={styles.orderCardStatus}
        />
        {order.status === 'pending' && onCancel && (
          <Button appearance="outline" size="small" onClick={onCancel} className="bts-marginLauto">
            Cancel
          </Button>
        )}
      </header>

      <div>
        {order.cartItems.map((item) => (
          <div key={item.productId} className={styles.orderCardCartItem}>
            <Image
              src={item.product.mainImage}
              alt={item.product.name}
              className={styles.orderCardCartItemImage}
            />
            <div className={styles.orderCardCartItemInfo}>
              <Button
                withoutPadding
                appearance="link"
                onClick={() => navigate('/product-details/' + item.productId)}
              >
                <span className={styles.orderCardCartItemName}>{item.product.name}</span>
              </Button>
              <div className={styles.orderCardCartItemQuantity}>X{item.quantity}</div>
            </div>
            <div className={styles.orderCardCartItemPrice}>
              {formatCurrency(item.product.price * item.quantity)}
            </div>
            <div className={styles.orderCardCartItemActions}>
              <Button
                color="secondary-light"
                onClick={() => onBuyAgain(item.product)}
                aria-label={`Buy again ${item.product.name}`}
              >
                Buy Again
              </Button>
              {(item.canReview || item.canEditReview) && (
                <Button
                  onClick={() => onAddReview(item)}
                  aria-label={`${item.canEditReview ? 'Edit' : 'Add'} review for ${item.product.name}`}
                >
                  {item.hasReview ? 'Edit Review' : 'Add Review'}
                </Button>
              )}
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
