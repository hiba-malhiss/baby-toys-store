export interface Category {
  id?: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isMain?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Admin translations
export interface CategoryTranslationDto {
  locale: 'en' | 'ar';
  name: string;
  description?: string;
}

export interface CategoryDetailsAdminDto extends Omit<Category, 'name' | 'description'> {
  name?: string | null;
  description?: string | null;
  translations: CategoryTranslationDto[];
}

export interface CategoryUpsertRequest {
  imageUrl?: string;
  isMain?: boolean;
  isActive?: boolean;
  translations: Array<{
    locale: 'en' | 'ar';
    name: string;
    description?: string;
  }>;
}
