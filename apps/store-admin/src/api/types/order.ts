export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  pricePerUnit: string;
  totalPrice: string;
  mainImage?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus | string;
  subtotal: string;
  discountAmount: string;
  total: string;
  couponCode?: string | null;
  items: OrderItem[];
}
