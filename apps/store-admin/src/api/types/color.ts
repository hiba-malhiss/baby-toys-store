export interface Color {
  id: string;
  name: string;
  code: string;
  createdAt?: string;
  updatedAt?: string;
}

// Admin translations
export interface ColorTranslationDto {
  locale: 'en' | 'ar' | string;
  name: string;
}

export interface ColorDetailsAdminDto {
  id: string | number;
  code: string;
  translations: ColorTranslationDto[];
}

export interface ColorUpsertRequest {
  code: string;
  translations: Array<{
    locale: 'en' | 'ar' | string;
    name: string;
  }>;
}
