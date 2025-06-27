import React, { useState } from 'react';
import Card from '../../../components/common/Card/Card.tsx';
import RadioButtonGroup from '../../../components/common/RadioButtonGroup/RadioButtonGroup.tsx';
import RadioButton from '../../../components/common/RadioButtonGroup/RadioButton.tsx';
import Slider from '../../../components/common/Slider/Slider.tsx';
import { Button } from '../../../components/common/Button/Button.tsx';
import {
  categoriesRadioOptions,
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
import styles from './side-filters.module.scss';
import { EmptyPlaceholder } from '../../../components/common/EmptyPlaceholder/EmptyPlaceholder.tsx';

export type ShopFilters = {
  category: string;
  color: string;
  brand: string;
  material: string;
  price: [number, number];
};

type SideFiltersProps = {
  className?: string;
  onFiltersChange: (filters: ShopFilters) => void;
};

export const SideFilters: React.FC<SideFiltersProps> = ({ className, onFiltersChange }) => {
  const [filters, setFilters] = useState<ShopFilters>({
    category: '',
    color: '',
    brand: '',
    material: '',
    price: DEFAULT_PRICE,
  });

  const handleFilterChange = (key: keyof ShopFilters, value: string | [number, number]) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    const cleared: ShopFilters = {
      category: '',
      color: '',
      brand: '',
      material: '',
      price: DEFAULT_PRICE,
    };
    setFilters(cleared);
    onFiltersChange(cleared);
  };
  const filtersCount = getActiveFiltersCount(filters);
  const removeFilter = (key: keyof ShopFilters) => {
    const updated = { ...filters, [key]: key === 'price' ? DEFAULT_PRICE : '' };
    setFilters(updated);
    onFiltersChange(updated);
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
          {getFilterChips(filters).map(({ key, label }) => (
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
            {categoriesRadioOptions.map(({ label, value }) => (
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
            direction="vertical"
            align="start"
            spacing="l"
          >
            {colorsRadioOptions.map(({ label, value }) => (
              <RadioButton key={value} value={value}>
                {label}
              </RadioButton>
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
            selectedValue={filters.material}
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
            value={filters.price}
            className="bts-marginTxl"
            onChange={(val: [number, number]) => handleFilterChange('price', val)}
          />
        </Accordion>
      </Flex>
    </Card>
  );
};
