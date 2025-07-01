import type { ShopFilters } from './SideFilters/side-filters.utils.ts';

const isEqual = (value1: any, value2: any): boolean => {
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false;
    return value1.every((v, i) => v === value2[i]);
  }
  return value1 === value2;
};

export const getActiveFilters = (filters: ShopFilters, defaultFilters: Record<string, any>) => {
  return Object.entries(filters).filter(([key, value]) => {
    const defaultValue = defaultFilters[key];
    if (value == null) return false;
    return !isEqual(value, defaultValue);
  });
};

export const getActiveFiltersCount = (
  filters: ShopFilters,
  defaultFilters: Record<string, any>
): number => {
  return getActiveFilters(filters, defaultFilters).length;
};

export const getFilterChips = (
  filters: ShopFilters,
  currencySymbol = '',
  defaultFilters: Record<string, any>
): { key: keyof ShopFilters; label: string }[] => {
  const chips: { key: keyof ShopFilters; label: string }[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    const defaultValue = defaultFilters[key as keyof ShopFilters];

    if (value == null || isEqual(value, defaultValue)) {
      return;
    }

    if (key === 'priceRange' && Array.isArray(value)) {
      chips.push({
        key: 'priceRange',
        label: `${value[0]}${currencySymbol} - ${value[1]}${currencySymbol}`,
      });
    } else {
      chips.push({ key: key as keyof ShopFilters, label: String(value) });
    }
  });

  return chips;
};
