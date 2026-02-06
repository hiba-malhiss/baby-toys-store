export interface AdminProductBase {
  id?: number;
  name: string;
  description?: string;
  shortDescription?: string;
  // Variant-level aggregates from backend
  lowestActivePrice?: number | null;
  oldPriceForLowestPrice?: number | null;
  activeVariantsTotalStock?: number | null;
  // Legacy fields (may be undefined now)
  price?: number | null;
  stockQuantity?: number | null;
  releaseDate?: string;
  mainImage?: string | null;
  images?: string[];
  featureBullets?: string[];
  details?: Record<string, string>;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  categoryId?: number | null;

  // Human-readable relation names from the API
  categoryName?: string | null;

  // Optional extra data
  oldPrice?: number | null; // legacy; prefer oldPriceForLowestPrice
  averageRating?: number | null;
  numberOfRatings?: number | null;
  sales?: number | null;

  costPrice?: number | null;
  totalRevenue?: number | null;
  totalCost?: number | null;
  totalProfit?: number | null;
  profitMargin?: number | null;
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

export interface ProductOptionDto {
  type: {
    id: number;
    name: string;
  };
  values: Array<{
    id: number;
    value: string;
    display?: string | null;
  }>;
}

import type { VariantDto } from './variant';

// Admin: product details with all translations
export interface ProductDetailsAdminDto extends AdminProductBase {
  translations: ProductTranslationDto[];
  variants: VariantDto[];
  options: ProductOptionDto[];
}

// Backend upsert payload with translations
export interface ProductUpsertRequest {
  // Non-localized fields (variant-first; price/stock are variant-level)
  releaseDate?: string;
  mainImage: string;
  images?: string[];
  isActive?: boolean;

  categoryId?: number;
  productSku?: string;

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
