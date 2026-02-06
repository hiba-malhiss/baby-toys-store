export interface AttributeType {
  id: number;
  code: string;
  isFilterable: boolean;
  isMultiselect: boolean;
  isActive: boolean;
  sortOrder: number;
  displayName?: string | null;
  translations?: Array<{
    locale: string;
    displayName?: string | null;
    description?: string | null;
  }>;
  values?: AttributeValue[];
}

export interface AttributeValue {
  id: number;
  code: string;
  display?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  translations?: Array<{
    locale: string;
    displayValue?: string | null;
  }>;
}

export interface AttributeTypeUpsertRequest {
  code: string;
  isFilterable?: boolean;
  isMultiselect?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  translations?: Array<{
    locale: string;
    displayName?: string | null;
    description?: string | null;
  }>;
}
