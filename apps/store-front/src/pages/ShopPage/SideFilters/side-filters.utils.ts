export const urlFilterParsers: Record<keyof ShopFilters, (val: string) => any> = {
  categoryId: (v) => v,
  discounts: (v) => (v === 'discounts' ? 'discounts' : undefined),
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
  attributesJson: (v) => v,
};

export type ShopFilters = {
  categoryId?: string;
  priceRange?: [number, number];
  discounts?: 'discounts';
  attributesJson?: string; // JSON string: { [typeId: string]: number[] }
};
