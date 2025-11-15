export interface Product {
  id: number;
  productSku?: string | null;
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  price: number;
  stockQuantity?: number | null;
  releaseDate?: string | null;
  mainImage?: string | null;
  images?: string[];
  featureBullets?: string[];
  details?: Record<string, string>;
  isActive?: boolean | null;
  outOfStock?: boolean | null;

  categoryId?: number | null;
  categoryName?: string | null;
  brandId?: number | null;
  brandName?: string | null;
  colorIds?: number[];
  colorCodes?: string[];
  materialIds?: number[];
  materialNames?: string[];
  averageRating?: number | null;
  numberOfRatings?: number | null;

  oldPrice?: number | null;
  sales?: number | null;
}
