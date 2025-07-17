export interface Product {
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
  shortDescription?: string;
  featureBullets?: string[];
  details?: { label: string; value: string }[];
  availableInStock?: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductWithFavorite extends Product {
  isUserFavorite: boolean;
}

export interface CartItemBE {
  productId: string;
  quantity: number;
}

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
  date: string;
  cartItems: OrderCartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingInfo: ShippingInfo;
}

export interface OrderPayload {
  cartItems: CartItem[];
  shippingCost: number;
  total: number;
  shippingInfo: ShippingInfo;
}

export interface ShippingInfo {
  country: string;
  firstName: string;
  lastName: string;
  region: string;
  address: string;
  town: string;
  phone: string;
  email?: string;
  zipCode?: string;
}

export interface Review {
  rating: number;
  name: string;
  avatarUrl?: string;
  comment: string;
  date?: string;
  orderId?: string;
  productId?: string;
  id?: string;
}

export interface InfoCardType {
  appearance?: 'info' | 'warning' | 'success';
  icon: any;
  title: string;
  content: string;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  description?: string;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
}

export interface Color {
  id: string;
  name: string;
  code: string;
}

export interface Material {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
