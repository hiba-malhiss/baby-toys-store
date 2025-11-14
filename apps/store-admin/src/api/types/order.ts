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
  originalPrice: string;
  totalPrice: string;
  mainImage?: string;
  costPrice?: string;
  itemCostTotal?: string;
  itemProfit?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  town: string;
  region: string;
  detailedAddress: string;
  phoneNumber: string;
  secondPhoneNumber?: string | null;
  email?: string | null;
}

export interface Order {
  id: number;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus | string;
  subtotal: string;
  shippingCost?: string;
  discountAmount: string;
  total: string;
  couponCode?: string | null;
  items: OrderItem[];
  totalCost?: string;
  totalProfit?: string;
  profitMargin?: string;
  shippingAddress?: ShippingAddress;
  note?: string | null;
}
