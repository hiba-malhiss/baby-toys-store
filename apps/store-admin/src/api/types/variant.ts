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
  optionSelections?: Record<number, number>;
}
