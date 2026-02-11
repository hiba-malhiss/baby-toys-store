export interface Category {
  id?: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isMain?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttributeValuePublicDto {
  id: number;
  code: string;
  displayValue: string;
  sortOrder: number;
}

export interface AttributeTypePublicDto {
  id: number;
  code: string;
  displayName: string;
  multiselect: boolean;
  sortOrder: number;
  values: AttributeValuePublicDto[];
}
