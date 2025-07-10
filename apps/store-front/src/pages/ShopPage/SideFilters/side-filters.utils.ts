export const urlFilterParsers: Record<keyof ShopFilters, (val: string) => any> = {
  category: (v) => v,
  brand: (v) => v,
  color: (v) => v,
  material: (v) => v,
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
  category?: string;
  color?: string;
  brand?: string;
  material?: string;
  priceRange?: [number, number];
};
