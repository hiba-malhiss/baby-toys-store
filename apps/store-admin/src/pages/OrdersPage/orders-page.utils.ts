import { OrderStatus } from '../../api/types/order.ts';

export const orderStatusOptions = [
  { label: 'Pending', value: OrderStatus.PENDING },
  { label: 'Processing', value: OrderStatus.PROCESSING },
  { label: 'Shipped', value: OrderStatus.SHIPPED },
  { label: 'Delivered', value: OrderStatus.DELIVERED },
  { label: 'Cancelled', value: OrderStatus.CANCELLED },
  { label: 'Returned', value: OrderStatus.RETURNED },
];

export const statusColorMap: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.PROCESSING]: 'info',
  [OrderStatus.SHIPPED]: 'primary',
  [OrderStatus.DELIVERED]: 'success',
  [OrderStatus.CANCELLED]: 'secondary',
  [OrderStatus.RETURNED]: 'secondary',
};

// Frontend mirror of backend allowed transitions
export const allowedTransitions: Record<OrderStatus, Set<OrderStatus>> = {
  [OrderStatus.PENDING]: new Set([OrderStatus.PROCESSING, OrderStatus.CANCELLED]),
  [OrderStatus.PROCESSING]: new Set([OrderStatus.SHIPPED, OrderStatus.CANCELLED]),
  [OrderStatus.SHIPPED]: new Set([OrderStatus.DELIVERED, OrderStatus.RETURNED]),
  [OrderStatus.DELIVERED]: new Set([OrderStatus.RETURNED]),
  [OrderStatus.CANCELLED]: new Set<OrderStatus>(),
  [OrderStatus.RETURNED]: new Set<OrderStatus>(),
};

export function isTransitionAllowed(from: OrderStatus, to: OrderStatus): boolean {
  return allowedTransitions[from]?.has(to) ?? false;
}

export function getAllowedStatusOptions(current: OrderStatus) {
  return orderStatusOptions.filter((opt) => isTransitionAllowed(current, opt.value));
}

export function canAdminEdit(status: OrderStatus): boolean {
  return status === OrderStatus.PENDING || status === OrderStatus.PROCESSING;
}
