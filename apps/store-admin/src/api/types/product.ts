export interface AdminProductBase {
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
  createdAt?: string;
  updatedAt?: string;
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

// Admin: product details with all translations
export interface ProductDetailsAdminDto extends AdminProductBase {
  translations: ProductTranslationDto[];
}

// Backend upsert payload with translations
export interface ProductUpsertRequest {
  // Non-localized fields
  price: number;
  costPrice?: number | null;
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
