import type { OrderItem } from '../components/common/OrderSummary/OrderSummary.tsx';

export const calculateOrderSummary = (items: OrderItem[], shipping: number) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  const total = subtotal + shipping;

  return { subtotal: subtotal.toFixed(2), total: total.toFixed(2) };
};
