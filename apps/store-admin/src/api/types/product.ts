export interface AdminProductBase {
  id: number;
  productSku?: string | null;
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  activeVariantsTotalStock?: number | null;
  defaultVariant?: VariantDto | null;
  releaseDate?: string | null;
  mainImage?: string | null;
  images?: string[];
  featureBullets?: string[];
  details?: Record<string, string>;
  isActive?: boolean | null;
  outOfStock?: boolean | null;

  categoryId?: number | null;
  categoryName?: string | null;

  // Details-only fields
  variants?: VariantDto[];
  options?: ProductOptionDto[];
  attributes?: ProductAttributeDto[];

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
    translations: {locale: string, displayName: string}[]
  };
  values: Array<{
    id: number;
    value: string;
    translations: {locale: string, display: string}[]
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
