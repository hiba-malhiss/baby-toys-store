export interface Product {
  id?: number;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  stockQuantity: number;
  releaseDate?: string;
  mainImage?: string;
  images?: string[];
  featureBullets?: string[];
  details?: Record<string, string>;
  isActive?: boolean;
  categoryId?: number;
  brandId?: number;
  materialIds?: number[];
  colorIds?: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  stockQuantity: number;
  releaseDate?: string;
  mainImage?: string;
  images?: string[];
  featureBullets?: string[];
  details?: Record<string, string>;
  isActive?: boolean;
  categoryId?: number;
  brandId?: number;
  materialIds?: number[];
  colorIds?: number[];
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: number;
} 