import type { ShopFilters } from './SideFilters/side-filters.utils';
import { useCategories, useFilterableAttributes } from '../../api/catalogApi';
import { useStoreSettings } from '../../api/settingsApi';
import { useTranslation } from 'react-i18next';
import { parseAttributeFilters } from '../../utils/filters.utils.ts';

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
): { key: string; label: string }[] => {
  const { t } = useTranslation('common');
  const { data: settings } = useStoreSettings();
  const { data: categories = [] } = useCategories();
  const { data: attributeTypes = [] } = useFilterableAttributes();

  const currencySymbol = settings?.general?.currencySymbol || '';

  const chips: { key: string; label: string }[] = [];

  const { selectedAttrs } = parseAttributeFilters(filters);

  Object.entries(filters).forEach(([key, value]) => {
    const defaultValue = defaultFilters[key as keyof ShopFilters];

    if (value == null || isEqual(value, defaultValue)) return;

    if (key.startsWith('attr_')) {
      const typeId = key.replace('attr_', '');
      const values = selectedAttrs[String(typeId)] ?? [];
      if (values.length === 0) return;

      const type = attributeTypes.find((t) => Number(t.id) === Number(typeId));
      if (!type) return;

      const val = type.values.find((v) => Number(v.id) === values[0]);
      const label = val?.displayValue || type.displayName;
      chips.push({ key, label });
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

      case 'categoryId': {
        const name = categories.find((c) => String(c.id) === String(value))?.name || String(value);
        chips.push({ key: 'categoryId', label: name });
        break;
      }

      case 'discounts':
        chips.push({
          key: 'discounts',
          label: t('filters.discounts', { defaultValue: 'Discounts' }),
        });
        break;

      default:
        chips.push({ key: String(key), label: String(value) });
    }
  });

  return chips;
};
