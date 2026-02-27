import {
  parseAttributeFilters,
  parseOptionFilters,
  type ShopFilters,
} from './SideFilters/side-filters.utils';
import { useCategories, useFilterableAttributes, useFilterableOptions } from '../../api/catalogApi';
import { useStoreSettings } from '../../api/settingsApi';
import { useTranslation } from 'react-i18next';

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
  const { data: optionTypes = [] } = useFilterableOptions();

  const currencySymbol = settings?.general?.currencySymbol || '';

  const chips: { key: string; label: string }[] = [];

  // Parse dynamic attribute filters (attr_*) and options (opt_*)
  const { selectedAttrs } = parseAttributeFilters(filters);
  const { selectedOpts } = parseOptionFilters(filters);

  Object.entries(filters).forEach(([key, value]) => {
    const defaultValue = defaultFilters[key as keyof ShopFilters];

    if (value == null || isEqual(value, defaultValue)) return;

    if (key.startsWith('attr_')) {
      const typeId = key.replace('attr_', '');
      const values = selectedAttrs[String(typeId)] ?? [];

      if (values.length === 0) return;

      const type = attributeTypes.find((t) => Number(t.id) === Number(typeId));
      if (!type) return;

      values.forEach((valueId) => {
        const attributeValue = type.values.find((v) => Number(v.id) === valueId);

        chips.push({
          key: `${key}_${valueId}`, // required for removeFilter logic
          label: attributeValue?.displayValue || type.displayName,
        });
      });

      return;
    }

    if (key.startsWith('opt_')) {
      const typeId = key.replace('opt_', '');
      const values = selectedOpts[String(typeId)] ?? [];

      if (values.length === 0) return;

      const type = optionTypes.find((t) => Number(t.id) === Number(typeId));
      if (!type) return;

      values.forEach((valueId) => {
        const v = type.values.find((vv) => Number(vv.id) === valueId);

        chips.push({
          key: `${key}_${valueId}`, // required for removeFilter logic in SideFilters
          label: v?.display || v?.value || type.displayName || type.name,
        });
      });

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

      case 'categoryIds':
        if (Array.isArray(value)) {
          value.forEach((id) => {
            const categoryName = categories.find((c) => String(c.id) === id)?.name || id;

            chips.push({
              key: `categoryIds_${id}`,
              label: categoryName,
            });
          });
        }
        break;

      case 'discounts':
        chips.push({
          key: 'discounts',
          label: t('filters.discounts', { defaultValue: 'Discounts' }),
        });
        break;

      case 'inStock':
        chips.push({
          key: 'inStock',
          label: t('filters.inStock', { defaultValue: 'In stock' }),
        });
        break;

      default:
        break;
    }
  });

  return chips;
};
