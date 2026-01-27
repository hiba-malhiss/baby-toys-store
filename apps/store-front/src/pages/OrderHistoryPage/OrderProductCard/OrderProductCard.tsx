import styles from './order-product-card.module.scss';
import { useState } from 'react';
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@baby-toys/ui-kit/utils';
import { Button, Card, Chip, Image } from '@baby-toys/ui-kit';
import { faCircleArrowDown, faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';
import type { Order, OrderItem } from '../../../api/ordersApi.ts';
import { useTranslation } from 'react-i18next';

export const statusColorMap: Record<string, string> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'success',
  delivered: 'primary',
};

type ProductLite = { id: string; name: string; price: number; mainImage: string };

interface OrderProductCardProps {
  onBuyAgain: (product: ProductLite) => void;
  onAddReview: (item: OrderItem) => void;
  onCancel?: () => void;
  isCancelling?: boolean;
  order: Order;
}

const OrderProductCard = ({
  order,
  onBuyAgain,
  onAddReview,
  onCancel,
  isCancelling,
}: OrderProductCardProps) => {
  const formatCurrency = useCurrencyFormatter();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const [expanded, setExpanded] = useState(false);
  const items = order.cartItems || [];
  const visibleItems = expanded ? items : items.slice(0, 2);

  return (
    <Card fullWidth size="small" className={styles.orderCard}>
      <header className={styles.orderCardHeader}>
        <div>{t('orders.orderNumber', { number: order.id })}</div>
        <div>{formatDate(order.date)}</div>
        <Chip
          label={order.status}
          severity={statusColorMap[order.status]}
          className={styles.orderCardStatus}
        />
        {order.status === 'pending' && onCancel && (
          <Button
            appearance="outline"
            size="small"
            onClick={onCancel}
            className="bts-marginLauto"
            isLoading={!!isCancelling}
            isDisabled={!!isCancelling}
          >
            {t('orders.cancel')}
          </Button>
        )}
      </header>

      <div>
        {visibleItems.map((item) => (
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
            <div className={styles.orderCardCartItemPrice}>{formatCurrency(item.totalPrice)}</div>
            <div className={styles.orderCardCartItemActions}>
              <Button
                color="secondary-light"
                onClick={() => onBuyAgain(item.product)}
                aria-label={t('orders.aria.buyAgain', { name: item.product.name })}
              >
                {t('orders.buyAgain')}
              </Button>
              {(item.canReview || item.canEditReview) && (
                <Button
                  onClick={() => onAddReview(item)}
                  aria-label={
                    item.canEditReview
                      ? t('orders.aria.editReview', { name: item.product.name })
                      : t('orders.aria.addReview', { name: item.product.name })
                  }
                >
                  {item.hasReview ? t('orders.editReview') : t('orders.addReview')}
                </Button>
              )}
            </div>
          </div>
        ))}
        {items.length > 2 && (
          <div className="bts-marginTs">
            <Button
              appearance="link"
              color="primary"
              leftIcon={expanded ? faCircleArrowUp : faCircleArrowDown}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded
                ? t('orders.showLess', { defaultValue: 'Show less' })
                : t('orders.showMore', {
                    defaultValue: 'Show more ({{count}})',
                    count: items.length - 2,
                  })}
            </Button>
          </div>
        )}
      </div>

      <footer className={styles.orderCardFooter}>
        <div>
          {t('orders.subtotal')}: {formatCurrency(order.subtotal)}
        </div>
        {order.couponCode ? (
          <div>
            {t('orders.coupon')}: {order.couponCode}
          </div>
        ) : null}
        {order.discountAmount ? (
          <div>
            {t('orders.discount')}: {order.discountAmount}
          </div>
        ) : null}
        <div>
          {t('orders.shipping')}: {formatCurrency(order.shippingCost)}
        </div>
        <div>
          {t('orders.total')}: {formatCurrency(order.total)}
        </div>
      </footer>
    </Card>
  );
};

export default OrderProductCard;
