export interface AdminProductBase {
  id?: number;
  name: string;
  description?: string;
  shortDescription?: string;

  releaseDate?: string;
  mainImage?: string | null;
  images?: string[];
  featureBullets?: string[];
  details?: Record<string, string>;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  categoryId?: number | null;
  categoryName?: string | null;
  defaultVariant: VariantDto

  // Optional extra data
  averageRating?: number | null;
  numberOfRatings?: number | null;
  sales?: number | null;

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

export interface ProductAttributeDto {
  typeId: number;
  typeCode: string;
  typeDisplayName: string;
  multiselect: boolean;
  values: Array<{
    id: number;
    code: string;
    displayValue: string;
    sortOrder?: number | null;
  }>;
}

export interface ProductDetailsAdminDto extends AdminProductBase {
  translations: ProductTranslationDto[];
  variants: VariantDto[];
  options: ProductOptionDto[];
  attributes?: ProductAttributeDto[];
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
  // Product-level attributes
  attributes?: Array<{
    attributeTypeId: number;
    valueIds: number[];
  }>;

  // Product options (option types and their selected values)
  options?: Array<{
    optionTypeId: number;
    valueIds: number[];
  }>;

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
