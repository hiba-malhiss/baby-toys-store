import type { ShopFilters } from './SideFilters/side-filters.utils.ts';
import { useBrands, useCategories, useColors, useMaterials } from '../../api/catalogApi.ts';
import { useStoreSettings } from '../../api/settingsApi';

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
  const { data: settings } = useStoreSettings();
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const { data: colors = [] } = useColors();
  const { data: materials = [] } = useMaterials();

  const currencySymbol = settings?.general?.currencySymbol || '';

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
        {
          const name =
            categories.find((c) => String(c.id) === String(value))?.name || String(value);
          chips.push({ key: 'categoryId', label: name });
        }
        break;

      case 'brandId':
        {
          const name = brands.find((b) => String(b.id) === String(value))?.name || String(value);
          chips.push({ key: 'brandId', label: name });
        }
        break;

      case 'colorId':
        {
          const color = colors.find((c) => String(c.id) === String(value));
          const label = color?.name || color?.code || String(value);
          chips.push({ key: 'colorId', label });
        }
        break;

      case 'materialId':
        {
          const name = materials.find((m) => String(m.id) === String(value))?.name || String(value);
          chips.push({ key: 'materialId', label: name });
        }
        break;

      default:
        chips.push({ key: key as keyof ShopFilters, label: String(value) });
    }
  });

  return chips;
};
