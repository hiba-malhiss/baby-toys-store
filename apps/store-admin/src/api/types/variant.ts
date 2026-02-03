export interface VariantDto {
  id: number;
  sku: string;
  barcode?: string | null;
  price: number;
  oldPrice?: number | null;
  costPrice?: number | null;
  stockQuantity: number;
  isActive: boolean;
  mainImage?: string | null;
  images?: string[];
  options?: string[];
  // Map of optionTypeId -> optionValueId for this variant (backend populated)
  optionSelectionIds?: Record<number, number>;
}

export interface CreateVariantRequest {
  sku: string;
  barcode?: string | null;
  price: number;
  oldPrice?: number | null;
  costPrice?: number | null;
  stockQuantity: number;
  isActive?: boolean;
  mainImage?: string | null;
  images?: string[];
  optionSelections?: Record<number, number>; // typeId -> valueId
}

export interface UpdateVariantRequest {
  sku?: string;
  barcode?: string | null;
  price?: number;
  oldPrice?: number | null;
  costPrice?: number | null;
  stockQuantity?: number;
  isActive?: boolean;
  mainImage?: string | null;
  images?: string[];
  optionSelections?: Record<number, number>;
}
