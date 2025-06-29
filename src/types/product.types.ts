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

export interface CartItem {
  productId: string; // foreign key to Product.id
  name: string;
  mainImage: string;
  price: number;
  quantity: number;
}

export type FilterOption = {
  value: string;
  label: string;
};

export type ProductCategory = {
  label: string;
  image: string;
};

export interface Feedback {
  rating: number;
  name: string;
  avatarUrl?: string;
  comment: string;
}

export type InfoCardType = {
  appearance?: 'info' | 'warning' | 'success';
  icon: any;
  title: string;
  content: string;
};
