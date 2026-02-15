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
  mainImage: string;
  variantId: number;
  variantSku: string;
  variantOptions: string[];
  quantity: number;
  originalPrice: number | null;
  pricePerUnit: number;
  totalPrice: number;
  hasReview?: boolean;
  canReview?: boolean;
  canEditReview?: boolean;
  reviewId?: number | null;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  townCode: string;
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
  totalWithShipping: string;
  couponCode?: string | null;
  items: OrderItem[];
  totalCost?: string;
  totalProfit?: string;
  profitMargin?: string;
  shippingAddress?: ShippingAddress;
  note?: string | null;
  freeShipping: boolean;
  deliveredAt?: string | null;
}
