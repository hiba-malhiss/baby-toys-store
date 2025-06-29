import type { ShopFilters } from './SideFilters/SideFilters.tsx';
import { DEFAULT_PRICE } from '../../mock-data/shop-page.ts';
import { SortOptions } from './SortProducts.tsx';

export const isPriceDefault = (price: [number, number]) =>
  price[0] === DEFAULT_PRICE[0] && price[1] === DEFAULT_PRICE[1];

export const getActiveFilters = (filters: ShopFilters) => {
  return Object.entries(filters).filter(([key, value]) => {
    if (key === 'priceRange') return !isPriceDefault(value as [number, number]);
    if (key === 'sortBy') return value !== 'featured'; // Don't count default sort as active filter
    return Boolean(value);
  });
};

export const getActiveFiltersCount = (filters: ShopFilters): number => {
  return getActiveFilters(filters).length;
};

export const getFilterChips = (
  filters: ShopFilters,
  currencySymbol: string = ''
): { key: keyof ShopFilters; label: string }[] => {
  const chips: { key: keyof ShopFilters; label: string }[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (key === 'priceRange' && value && !isPriceDefault(value as [number, number])) {
      const range = value as [number, number];
      chips.push({
        key: 'priceRange',
        label: `${range[0]}${currencySymbol} - ${range[1]}${currencySymbol}`,
      });
    } else if (key === 'sortBy' && value && value !== 'featured') {
      // Show sort as a chip if it's not the default
      const sortLabels: Record<string, string> = SortOptions.reduce((acc, { label, value }) => {
        acc[value] = label;
      }, {});
      chips.push({ key: 'sortBy', label: sortLabels[value as string] || (value as string) });
    } else if (value && key !== 'priceRange' && key !== 'sortBy') {
      chips.push({ key: key as keyof ShopFilters, label: String(value) });
    }
  });

  return chips;
};
