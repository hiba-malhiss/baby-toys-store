import type { ShopFilters } from './SideFilters/side-filters.utils.ts';
import { useStoreConfiguration } from '../../context/StoreConfigurationContext.tsx';

const isEqual = (value1: any, value2: any): boolean => {
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false;
    return value1.every((v, i) => v === value2[i]);
  }
  return value1 === value2;
};

export const useFilterChips = (
  filters: ShopFilters,
  defaultFilters: Record<string, any>
): { key: keyof ShopFilters; label: string }[] => {
  const { currency, getCategoryName, getBrandName, getColorName, getMaterialName } =
    useStoreConfiguration();

  const currencySymbol = currency?.symbol || '';

  const chips: { key: keyof ShopFilters; label: string }[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    const defaultValue = defaultFilters[key as keyof ShopFilters];

    if (value == null || isEqual(value, defaultValue)) {
      return;
    }

    switch (key) {
      case 'priceRange':
        if (Array.isArray(value)) {
          chips.push({
            key: 'priceRange',
            label: `${value[0]}${currencySymbol} - ${value[1]}${currencySymbol}`,
          });
        }
        break;

      case 'categoryId':
        chips.push({
          key: 'categoryId',
          label: getCategoryName(value),
        });
        break;

      case 'brandId':
        chips.push({
          key: 'brandId',
          label: getBrandName(value),
        });
        break;

      case 'colorId':
        chips.push({
          key: 'colorId',
          label: getColorName(value),
        });
        break;

      case 'materialId':
        chips.push({
          key: 'materialId',
          label: getMaterialName(value),
        });
        break;

      default:
        chips.push({ key: key as keyof ShopFilters, label: String(value) });
    }
  });

  return chips;
};
