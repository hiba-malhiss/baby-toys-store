import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type Product = {
  id: string;
  name: string;
  mainImage: string;
  images: string[];
  currency: string;
  price: number;
  oldPrice?: number;
  label?: 'SALE' | 'NEW' | string;
  rating: number;
  numberOfRatings: number;
  description?: string;
  featureBullets?: string[];
  details?: { label: string; value: string }[];
};

export interface Feedback {
  rating: number;
  name: string;
  avatarUrl?: string;
  comment: string;
}

export type InfoCardType = {
  appearance?: 'info' | 'warning' | 'success';
  icon: IconDefinition;
  title: string;
  content: string;
};

export type ProductCategory = {
  label: string;
  image: string;
};

export type RadioOption = {
  label: string;
  value: string;
};

export interface CartItem {
  productId: string;
  mainImage: string;
  name: string;
  price: number;
  quantity: number;
}
