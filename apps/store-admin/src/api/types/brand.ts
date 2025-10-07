export interface Brand {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Admin translations
export interface BrandTranslationDto {
  locale: 'en' | 'ar' | string;
  name: string;
  description?: string;
}

export interface BrandDetailsAdminDto extends Omit<Brand, 'name' | 'description'> {
  name?: string | null;
  description?: string | null;
  translations: BrandTranslationDto[];
}

export interface BrandUpsertRequest {
  logoUrl?: string;
  translations: Array<{
    locale: 'en' | 'ar' | string;
    name: string;
    description?: string;
  }>;
}
