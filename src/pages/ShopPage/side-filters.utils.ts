import type { ShopFilters } from './SideFilters/SideFilters.tsx';
import { DEFAULT_SORT_OPTION, SORT_OPTIONS } from '../../constants/filters.constants.ts';

export const isPriceDefault = (price: [number, number], defaultRange: [number, number]) =>
  price[0] === defaultRange[0] && price[1] === defaultRange[1];

export const getActiveFilters = (filters: ShopFilters, defaultPriceRange: [number, number]) => {
  return Object.entries(filters).filter(([key, value]) => {
    if (key === 'priceRange') return !isPriceDefault(value as [number, number], defaultPriceRange);
    if (key === 'sortBy') return value !== 'featured'; // Don't count default sort as active filter
    return Boolean(value);
  });
};

export const getActiveFiltersCount = (
  filters: ShopFilters,
  defaultPriceRange: [number, number]
): number => {
  return getActiveFilters(filters, defaultPriceRange).length;
};

export const getFilterChips = (
  filters: ShopFilters,
  currencySymbol: string = '',
  defaultPriceRange: [number, number]
): { key: keyof ShopFilters; label: string }[] => {
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
    } else if (key === 'sortBy' && value && value !== DEFAULT_SORT_OPTION) {
      // Show sort as a chip if it's not the default
      const sortLabels: Record<string, string> = SORT_OPTIONS.reduce(
        (acc, { label, value }) => {
          acc[value] = label;
          return acc;
        },
        {} as Record<string, string>
      );
      chips.push({ key: 'sortBy', label: sortLabels[value as string] || (value as string) });
    } else if (value && key !== 'priceRange' && key !== 'sortBy') {
      chips.push({ key: key as keyof ShopFilters, label: String(value) });
    }
  });

  return chips;
};
