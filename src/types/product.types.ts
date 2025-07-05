export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  color: string;
  material: string;
  mainImage: string;
  images: string[];
  price: number;
  oldPrice?: number;
  label?: 'SALE' | 'NEW' | string;
  rating: number;
  numberOfRatings: number;
  description?: string;
  featureBullets?: string[];
  details?: { label: string; value: string }[];
  quantityInStock?: number;
};

export type ProductWithFavorite = Product & { isUserFavorite: boolean };

// Type for cart item data stored in the backend (or mock storage)
export type CartItemBE = {
  productId: string;
  quantity: number;
};

// Rich cart item type used in the frontend, includes full product details
export interface CartItem extends CartItemBE {
  id?: string;
  dateAdded?: number;
  product: Product;
}

export interface OrderCartItem extends CartItem {
  isReviewed: boolean;
}

export interface OrderItem {
  id: number;
  email: string;
  date: string; // ISO date string, e.g. '2024-06-30T10:00:00Z'
  cartItems: OrderCartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingInfo: ShippingInfo;
}

export type OrderPayload = Omit<OrderItem, 'id' | 'email' | 'date' | 'subtotal'>;

export interface ShippingInfo {
  country: string;
  firstName: string;
  lastName: string;
  region: string;
  address: string;
  town: string;
  phone: string;
}

export interface Review {
  rating: number;
  name: string;
  avatarUrl?: string;
  comment: string;
  date?: string;
  orderId?: string;
}

export type InfoCardType = {
  appearance?: 'info' | 'warning' | 'success';
  icon: any;
  title: string;
  content: string;
};
