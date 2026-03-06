// Option admin DTOs and requests matching backend under
// com.pwn.toy.store.backend.variant.*

export interface OptionTypeTranslationDto {
  locale: string;
  displayName?: string;
  description?: string;
}

export interface OptionTypeDto {
  id: number;
  code: string;
  displayName?: string;
  description?: string;
  translations: OptionTypeTranslationDto[];
}

export interface OptionValueTranslationDto {
  locale: string;
  display: string;
}

export interface OptionValueDto {
  id: number;
  code?: string;
  display?: string;
  translations: OptionValueTranslationDto[];
}

export interface OptionTypeDetailDto {
  type: OptionTypeDto;
  values: OptionValueDto[];
}

export interface OptionTypeUpsertRequest {
  code?: string;
  translations?: Array<{
    locale: string;
    displayName?: string;
    description?: string;
  }>;
}

export interface OptionValueUpdateRequest {
  value: string;
  translations?: Record<string, string>;
}
