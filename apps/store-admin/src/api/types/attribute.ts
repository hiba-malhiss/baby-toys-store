export interface AttributeLocaleNameDescDto {
  locale: string;
  displayName: string;
  description?: string | null;
}

export interface AttributeLocaleValueDto {
  locale: string;
  displayValue: string;
}

export interface AttributeValueAdminDto {
  id: number;
  code: string;
  sortOrder?: number | null;
  isActive?: boolean | null;
  display?: string;
  translations: AttributeLocaleValueDto[];
}

export interface AttributeTypeAdminDto {
  id: number;
  code: string;
  isFilterable?: boolean | null;
  isMultiselect?: boolean | null;
  isActive?: boolean | null;
  sortOrder?: number | null;
  displayName?: string; // convenience display name
  translations: AttributeLocaleNameDescDto[];
  values: AttributeValueAdminDto[];
}

export interface AttributeTypeListDto {
  id: number;
  code: string;
  isFilterable?: boolean | null;
  isMultiselect?: boolean | null;
  isActive?: boolean | null;
  sortOrder?: number | null;
  displayName?: string;
}

export interface AttributeTypeUpsertRequest {
  code?: string;
  isFilterable?: boolean;
  isMultiselect?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  translations?: Array<{
    locale: string;
    displayName: string;
    description?: string;
  }>;
}
