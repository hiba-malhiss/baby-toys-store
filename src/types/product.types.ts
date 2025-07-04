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
};

export type ProductWithFavorite = Product & { isUserFavorite: boolean };

export interface CartItem {
  productId: string;
  name: string;
  mainImage: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: number;
  email: string;
  date: string; // ISO date string, e.g. '2024-06-30T10:00:00Z'
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

export interface Feedback {
  rating: number;
  name: string;
  avatarUrl?: string;
  comment: string;
  date: string;
}

export type InfoCardType = {
  appearance?: 'info' | 'warning' | 'success';
  icon: any;
  title: string;
  content: string;
};
