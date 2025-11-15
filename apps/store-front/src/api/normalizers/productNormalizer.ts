import type { Product } from '../types/product';

export type UiProduct = {
  id: number;
  productSku?: string | null;
  name: string;
  shortDescription?: string | null;
  mainImage?: string | null;
  price: number;
  oldPrice?: number | undefined;
  rating: number;
  isFavorite?: boolean | null;
  images?: string[];
  numberOfRatings?: number | null;
  featureBullets?: string[];
  details?: { label: string; value: string }[];
  availableInStock?: number;
  outOfStock?: boolean;
};

export function normalizeProduct(dto: Product): UiProduct {
  // Merge main image first, then the rest, remove falsy and duplicates
  const mergedImages = [dto.mainImage, ...(dto.images || [])].filter(Boolean);

  // Convert details record to array if present
  const detailsArray = dto.details
    ? Object.entries(dto.details).map(([label, value]) => ({ label, value }))
    : undefined;

  return {
    id: dto.id,
    productSku: dto.productSku ?? null,
    name: dto.name,
    shortDescription: dto.shortDescription,
    mainImage: dto.mainImage,
    price: Number(dto.price ?? 0),
    oldPrice: dto.oldPrice != null ? Number(dto.oldPrice) : undefined,
    rating: Number(dto.averageRating ?? 0),
    images: mergedImages,
    numberOfRatings: dto.numberOfRatings ?? 0,
    featureBullets: dto.featureBullets || [],
    details: detailsArray,
    availableInStock: dto.stockQuantity ?? 0,
    outOfStock: dto.outOfStock,
  };
}
