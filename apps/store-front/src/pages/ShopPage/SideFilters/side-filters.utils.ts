export const urlFilterParsers: Record<keyof ShopFilters, (val: string) => any> = {
  categoryId: (v) => v,
  brandId: (v) => v,
  colorId: (v) => v,
  materialId: (v) => v,
  priceRange: (v) => {
    try {
      const parsed = JSON.parse(v);
      if (
        Array.isArray(parsed) &&
        parsed.length === 2 &&
        typeof parsed[0] === 'number' &&
        typeof parsed[1] === 'number'
      ) {
        return parsed;
      }
    } catch {}
    return undefined;
  },
};

export type ShopFilters = {
  categoryId?: string;
  colorId?: string;
  brandId?: string;
  materialId?: string;
  priceRange?: [number, number];
};
