export interface Product {
  id: number;
  productSku?: string | null;
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  activeVariantsTotalStock?: number | null;
  defaultVariant?: Variant | null;
  releaseDate?: string | null;
  mainImage?: string | null;
  images?: string[];
  featureBullets?: string[];
  details?: Record<string, string>;
  isActive?: boolean | null;
  outOfStock?: boolean | null;

  categoryId?: number | null;
  categoryName?: string | null;
  averageRating?: number | null;
  numberOfRatings?: number | null;

  sales?: number | null;

  // Details-only fields
  variants?: Variant[];
  options?: ProductOption[];
  attributes?: ProductAttribute[];
}

export interface Variant {
  id: number;
  sku: string;
  price: number;
  oldPrice?: number | null;
  costPrice?: number | null;
  stockQuantity?: number | null;
  isActive?: boolean | null;
  mainImage?: string | null;
  options?: string[];
  optionSelectionIds?: Record<number, number>; // typeId -> valueId
}

export interface OptionType {
  id: number;
  name: string;
  displayName?: string | null;
  description?: string | null;
}

export interface OptionValue {
  id: number;
  value: string;
  display?: string | null;
}

export interface ProductOption {
  type: OptionType;
  values: OptionValue[];
}

export interface ProductAttributeValueDto {
  id: number;
  code: string;
  displayValue: string;
  sortOrder: number;
}

export interface ProductAttribute {
  typeId: number;
  typeCode: string;
  typeDisplayName: string;
  multiselect: boolean;
  values: ProductAttributeValueDto[];
}
