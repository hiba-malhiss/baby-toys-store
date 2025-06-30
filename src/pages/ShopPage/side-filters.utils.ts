import type { ShopFilters } from './SideFilters/SideFilters.tsx';

export const isPriceDefault = (price: [number, number], defaultRange: [number, number]) =>
  price[0] === defaultRange[0] && price[1] === defaultRange[1];

export const getActiveFilters = (filters: ShopFilters, defaultPriceRange: [number, number]) => {
  if (!defaultPriceRange) return [];
  return Object.entries(filters).filter(([key, value]) => {
    if (key === 'priceRange')
      return value && !isPriceDefault(value as [number, number], defaultPriceRange);
    return Boolean(value);
  });
};

export const getActiveFiltersCount = (
  filters: ShopFilters,
  defaultPriceRange: [number, number]
): number => {
  if (!defaultPriceRange) return 0;
  return getActiveFilters(filters, defaultPriceRange).length;
};

export const getFilterChips = (
  filters: ShopFilters,
  currencySymbol: string = '',
  defaultPriceRange: [number, number]
): { key: keyof ShopFilters; label: string }[] => {
  if (!defaultPriceRange) return [];
  const chips: { key: keyof ShopFilters; label: string }[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (
      key === 'priceRange' &&
      value &&
      !isPriceDefault(value as [number, number], defaultPriceRange)
    ) {
      const range = value as [number, number];
      chips.push({
        key: 'priceRange',
        label: `${range[0]}${currencySymbol} - ${range[1]}${currencySymbol}`,
      });
    } else if (value && key !== 'priceRange') {
      chips.push({ key: key as keyof ShopFilters, label: String(value) });
    }
  });

  return chips;
};
