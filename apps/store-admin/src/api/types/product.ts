export interface Product {
  id?: number;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  stockQuantity: number;
  releaseDate?: string;
  mainImage?: string | null;
  images?: string[];
  featureBullets?: string[];
  details?: Record<string, string>;
  isActive?: boolean;

  // Relations (IDs)
  categoryId?: number | null;
  brandId?: number | null;
  materialIds?: number[];
  colorIds?: number[];

  // Human-readable relation names from the API
  categoryName?: string | null;
  brandName?: string | null;
  materialNames?: string[];
  colorCodes?: string[];

  // Optional extra data
  oldPrice?: number | null;
  rating?: number | null;
  numberOfRatings?: number | null;
  sales?: number | null;

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
