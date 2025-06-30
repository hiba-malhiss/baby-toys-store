import React, { useState, useEffect } from 'react';
import Card from '../../../components/common/Card/Card.tsx';
import RadioButtonGroup, {
  type RadioOption,
} from '../../../components/common/RadioButtonGroup/RadioButtonGroup.tsx';
import RadioButton from '../../../components/common/RadioButtonGroup/RadioButton.tsx';
import Slider from '../../../components/common/Slider/Slider.tsx';
import { Button } from '../../../components/common/Button/Button.tsx';
import { useShopFilterOptions } from '../../../hooks/useShopFilterOptions';
import { useDebounce } from '../../../hooks/useDebounce';
import Flex from '../../../components/common/Flex/Flex.tsx';
import Chip from '../../../components/common/Chip/Chip.tsx';
import { Divider } from '../../../components/common/Divider/Divider.tsx';
import { Accordion } from '../../../components/common/Accordion/Accordion.tsx';
import { getActiveFiltersCount, getFilterChips } from '../side-filters.utils.ts';
import { useStoreConfiguration } from '../../../context/StoreConfigurationContext.tsx';
import styles from './side-filters.module.scss';
import { EmptyPlaceholder } from '../../../components/common/EmptyPlaceholder/EmptyPlaceholder.tsx';

export type ShopFilters = {
  category?: string;
  color?: string;
  brand?: string;
  material?: string;
  search?: string;
  priceRange?: [number, number];
};

type SideFiltersProps = {
  className?: string;
  onFiltersChange: (filters: ShopFilters) => void;
  initialFilters?: ShopFilters;
  categoriesOptions?: RadioOption[];
};

export const SideFilters: React.FC<SideFiltersProps> = ({
  className,
  onFiltersChange,
  initialFilters,
  categoriesOptions = [],
}) => {
  const { currency } = useStoreConfiguration();
  const { colors, brands, materials, priceRange, loading: filterLoading } = useShopFilterOptions();
  const [filters, setFilters] = useState<ShopFilters>({});
  const debouncedFilters = useDebounce(filters, 400);

  // Initialize filters from initialFilters prop
  useEffect(() => {
    if (initialFilters && !Object.values(filters).length) {
      setFilters({
        category: initialFilters.category,
        color: initialFilters.color,
        brand: initialFilters.brand,
        material: initialFilters.material,
        search: initialFilters.search,
        priceRange: initialFilters.priceRange || priceRange,
      });
    }
  }, [initialFilters, priceRange]);

  useEffect(() => {
    onFiltersChange(debouncedFilters);
  }, [debouncedFilters, onFiltersChange]);

  const handleFilterChange = (key: keyof ShopFilters, value: string | [number, number]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: undefined,
      color: undefined,
      brand: undefined,
      material: undefined,
      priceRange: priceRange,
    });
  };

  const removeFilter = (key: keyof ShopFilters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === 'priceRange' ? priceRange : undefined,
    }));
  };

  const filtersCount = getActiveFiltersCount(filters, priceRange);

  if (filterLoading) return null;
  return (
    <Card
      header={
        <Flex justify="between" align="center" fullWidth>
          <span>Filters {filtersCount > 0 && `(${filtersCount})`}</span>
          {filtersCount > 0 && (
            <Button
              appearance="link"
              color="highlighted"
              size="xsmall"
              onClick={clearFilters}
              withoutPadding
            >
              Clear Filters
            </Button>
          )}
        </Flex>
      }
      className={className}
    >
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex wrap spacing="m" fullWidth className={styles.sideFilterChipsContainer}>
          {getFilterChips(filters, currency?.symbol || '', priceRange).map(({ key, label }) => (
            <Chip
              key={key}
              appearance="secondary-outline"
              label={label}
              onClose={() => removeFilter(key)}
            />
          ))}
          {filtersCount < 1 && <EmptyPlaceholder message="No filters applied" align="start" />}
        </Flex>
        <Divider className="bts-marginTxl" />

        <Accordion header="Category" withoutPadding>
          <RadioButtonGroup
            name="category"
            selectedValue={filters.category}
            onChange={(val) => handleFilterChange('category', val)}
            direction="vertical"
            align="start"
            spacing="l"
          >
            {categoriesOptions.map(({ label, value }) => (
              <RadioButton key={value} value={value}>
                {label}
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </Accordion>

        <Accordion header="Color" withoutPadding>
          <RadioButtonGroup
            name="color"
            selectedValue={filters.color}
            onChange={(val) => handleFilterChange('color', val)}
            direction="horizontal"
            align="start"
            spacing="l"
            appearance="color-swatch"
          >
            <RadioButton key="multi" value="multi" name="color" isRainbow />
            {colors.map(({ value }) => (
              <RadioButton key={value} value={value} name="color" swatchColor={value} />
            ))}
          </RadioButtonGroup>
        </Accordion>

        <Accordion header="Brand" withoutPadding>
          <RadioButtonGroup
            name="brand"
            selectedValue={filters.brand}
            onChange={(val) => handleFilterChange('brand', val)}
            direction="vertical"
            spacing="l"
            align="start"
          >
            {brands.map(({ label, value }) => (
              <RadioButton key={value} value={value}>
                {label}
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </Accordion>

        <Accordion header="Material" withoutPadding>
          <RadioButtonGroup
            name="material"
            selectedValue={filters.material}
            onChange={(val) => handleFilterChange('material', val)}
            direction="vertical"
            spacing="l"
            align="start"
          >
            {materials.map(({ label, value }) => (
              <RadioButton key={value} value={value}>
                {label}
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </Accordion>

        <Accordion header="Price" withoutPadding>
          <Slider
            min={priceRange[0]}
            max={priceRange[1]}
            step={1}
            range
            value={filters.priceRange || priceRange}
            className="bts-marginTxl"
            onChange={(val: [number, number]) => handleFilterChange('priceRange', val)}
          />
        </Accordion>
      </Flex>
    </Card>
  );
};
