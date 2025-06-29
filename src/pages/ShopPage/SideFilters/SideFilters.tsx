import React, { useState, useEffect } from 'react';
import Card from '../../../components/common/Card/Card.tsx';
import RadioButtonGroup, {
  type RadioOption,
} from '../../../components/common/RadioButtonGroup/RadioButtonGroup.tsx';
import RadioButton from '../../../components/common/RadioButtonGroup/RadioButton.tsx';
import Slider from '../../../components/common/Slider/Slider.tsx';
import { Button } from '../../../components/common/Button/Button.tsx';
import {
  colorsRadioOptions,
  brandsRadioOptions,
  materialsRadioOptions,
  DEFAULT_PRICE,
} from '../../../mock-data/shop-page.ts';
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
  sortBy?: string;
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
  const [filters, setFilters] = useState<ShopFilters>({});

  // Update filters when initialFilters change (from URL)
  useEffect(() => {
    if (initialFilters) {
      setFilters({
        category: initialFilters.category || '',
        color: initialFilters.color || '',
        brand: initialFilters.brand || '',
        material: initialFilters.material || '',
        sortBy: initialFilters.sortBy || 'featured',
        search: initialFilters.search || '',
        priceRange: initialFilters.priceRange || DEFAULT_PRICE,
      });
    }
  }, [initialFilters]);

  const handleFilterChange = (key: keyof ShopFilters, value: string | [number, number]) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };
      onFiltersChange(updated);
      return updated;
    });
  };

  const clearFilters = () => {
    const cleared: ShopFilters = {
      category: '',
      color: '',
      brand: '',
      material: '',
      sortBy: 'featured',
      search: '',
      priceRange: DEFAULT_PRICE,
    };
    setFilters(cleared);
    onFiltersChange(cleared);
  };

  const filtersCount = getActiveFiltersCount(filters);

  const removeFilter = (key: keyof ShopFilters) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
        [key]: key === 'priceRange' ? DEFAULT_PRICE : key === 'sortBy' ? 'featured' : '',
      };
      onFiltersChange(updated);
      return updated;
    });
  };

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
          {getFilterChips(filters, currency?.symbol || '').map(({ key, label }) => (
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
            selectedValue={filters.category || ''}
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
            selectedValue={filters.color || ''}
            onChange={(val) => handleFilterChange('color', val)}
            direction="horizontal"
            align="start"
            spacing="l"
            appearance="color-swatch"
          >
            <RadioButton key="multi" value="multi" name="color" isRainbow />
            {colorsRadioOptions.map(({ value }) => (
              <RadioButton key={value} value={value} name="color" swatchColor={value} />
            ))}
          </RadioButtonGroup>
        </Accordion>

        <Accordion header="Brand" withoutPadding>
          <RadioButtonGroup
            name="brand"
            selectedValue={filters.brand || ''}
            onChange={(val) => handleFilterChange('brand', val)}
            direction="vertical"
            spacing="l"
            align="start"
          >
            {brandsRadioOptions.map(({ label, value }) => (
              <RadioButton key={value} value={value}>
                {label}
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </Accordion>

        <Accordion header="Material" withoutPadding>
          <RadioButtonGroup
            name="material"
            selectedValue={filters.material || ''}
            onChange={(val) => handleFilterChange('material', val)}
            direction="vertical"
            spacing="l"
            align="start"
          >
            {materialsRadioOptions.map(({ label, value }) => (
              <RadioButton key={value} value={value}>
                {label}
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </Accordion>

        <Accordion header="Price" withoutPadding>
          <Slider
            min={DEFAULT_PRICE[0]}
            max={DEFAULT_PRICE[1]}
            step={1}
            range
            value={filters.priceRange || DEFAULT_PRICE}
            className="bts-marginTxl"
            onChange={(val: [number, number]) => handleFilterChange('priceRange', val)}
          />
        </Accordion>
      </Flex>
    </Card>
  );
};
