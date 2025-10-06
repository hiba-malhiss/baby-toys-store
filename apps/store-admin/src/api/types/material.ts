export interface Material {
  id: number;
  name: string;
  description?: string | null;
}

// Public list item is already localized per Accept-Language

// Admin translation DTO
export interface MaterialTranslationDto {
  locale: string;
  name: string;
  description?: string | null;
}

// Admin details with all translations
export interface MaterialDetailsAdminDto extends Material {
  translations: MaterialTranslationDto[];
}

// Admin upsert payload
export interface MaterialUpsertRequest {
  translations: Array<{
    locale: 'en' | 'ar' | string;
    name: string;
    description?: string | null;
  }>;
  isActive?: boolean;
}
