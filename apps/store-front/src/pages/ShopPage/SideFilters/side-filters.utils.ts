export const urlFilterParsers: Record<string, (val: string) => any> = {
  categoryIds: (v) => v.split(',').filter(Boolean),
  discounts: (v) => (v === 'discounts' ? 'discounts' : undefined),
  inStock: (v) => (v === 'inStock' ? 'inStock' : undefined),
  priceRange: (v) => {
    const [min, max] = v.split(',').map(Number);
    return !isNaN(min) && !isNaN(max) ? [min, max] : undefined;
  },
};

export type ShopFilters = {
  categoryIds?: string[];
  priceRange?: [number, number];
  discounts?: 'discounts';
  inStock?: 'inStock';
};

export type Filters = Record<string, any>;

export interface ParsedAttributes {
  attrsSignature: string;
  selectedAttrs: Record<string, number[]>;
  attrsBody: Record<string, number[]>;
}

export const parseAttributeFilters = (filters?: Filters): ParsedAttributes => {
  const selected: Record<string, number[]> = {};

  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (!key.startsWith('attr_') || !Array.isArray(value)) return;

    const typeId = key.replace('attr_', '');
    if (value.length > 0) {
      selected[typeId] = value;
    }
  });

  const signature = Object.entries(selected)
    .map(([k, v]) => `attr_${k}=${v.join(',')}`)
    .sort()
    .join('|');

  return {
    attrsSignature: signature,
    selectedAttrs: selected,
    attrsBody: selected,
  };
};

export interface ParsedOptions {
  optsSignature: string;
  selectedOpts: Record<string, number[]>;
  optsBody: Record<string, number[]>;
}

export const parseOptionFilters = (filters?: Filters): ParsedOptions => {
  const selected: Record<string, number[]> = {};

  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (!key.startsWith('opt_') || !Array.isArray(value)) return;

    const typeId = key.replace('opt_', '');
    if (value.length > 0) {
      selected[typeId] = value as number[];
    }
  });

  const signature = Object.entries(selected)
    .map(([k, v]) => `opt_${k}=${v.join(',')}`)
    .sort()
    .join('|');

  return {
    optsSignature: signature,
    selectedOpts: selected,
    optsBody: selected,
  };
};
