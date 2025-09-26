import type { Product } from '../types/product';

export type UiProduct = {
  id: number;
  name: string;
  shortDescription?: string | null;
  mainImage?: string | null;
  price: number;
  oldPrice?: number | undefined;
  rating: number;
  isFavorite?: boolean | null;
};

export function normalizeProduct(dto: Product): UiProduct {
  return {
    id: dto.id,
    name: dto.name,
    shortDescription: dto.shortDescription,
    mainImage: dto.mainImage,
    price: Number(dto.price ?? 0),
    oldPrice: dto.oldPrice != null ? Number(dto.oldPrice) : undefined,
    rating: Number(dto.averageRating ?? 0),
    isFavorite: dto.inWishlist ?? null,
  };
}
