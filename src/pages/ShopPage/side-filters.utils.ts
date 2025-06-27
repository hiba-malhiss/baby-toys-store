import type { ShopFilters } from './SideFilters.tsx';
import { DEFAULT_PRICE } from '../../mock-data/shop-page.ts';

export const isPriceDefault = (price: [number, number]) =>
  price[0] === DEFAULT_PRICE[0] && price[1] === DEFAULT_PRICE[1];

export const getActiveFilters = (filters: ShopFilters) => {
  return Object.entries(filters).filter(([key, value]) => {
    if (key === 'price') return !isPriceDefault(value as [number, number]);
    return Boolean(value);
  });
};

export const getActiveFiltersCount = (filters: ShopFilters): number => {
  return getActiveFilters(filters).length;
};

export const getFilterChips = (
  filters: ShopFilters
): { key: keyof ShopFilters; label: string }[] => {
  const chips: { key: keyof ShopFilters; label: string }[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (key === 'price' && !isPriceDefault(value as [number, number])) {
      chips.push({ key: 'price', label: `${value[0]}$ - ${value[1]}$` });
    } else if (value && key !== 'price') {
      chips.push({ key: key as keyof ShopFilters, label: String(value) });
    }
  });

  return chips;
};
