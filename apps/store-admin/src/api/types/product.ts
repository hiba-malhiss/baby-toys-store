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

// Admin: translation DTO
export interface ProductTranslationDto {
  locale: string;
  name: string;
  shortDescription: string;
  description?: string;
  featureBullets?: string[];
  details?: Record<string, string>;
}

// Admin: product details with all translations
export interface ProductDetailsAdminDto extends Product {
  translations: ProductTranslationDto[];
}

// Backend upsert payload with translations
export interface ProductUpsertRequest {
  // Non-localized fields
  price: number;
  oldPrice?: number | null;
  stockQuantity: number;
  releaseDate?: string;
  mainImage: string;
  images?: string[];
  isActive?: boolean;

  categoryId?: number;
  brandId?: number;
  materialIds?: number[];
  colorIds?: number[];

  // Localized content per locale (e.g., en, ar)
  translations: Array<{
    locale: 'en' | 'ar' | string;
    name: string;
    shortDescription: string;
    description?: string;
    featureBullets?: string[];
    details?: Record<string, string>;
  }>;
}
