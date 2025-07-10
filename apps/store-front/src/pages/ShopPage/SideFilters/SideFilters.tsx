import React, { useEffect } from 'react';
import {
  Card,
  RadioButtonGroup,
  RadioButton,
  Slider,
  Button,
  Flex,
  Chip,
  Divider,
  Accordion,
  BouncingDotsLoader,
  NoDataFound,
  type RadioOption,
} from '@baby-toys/ui-kit/components';
import { useShopFilterOptions } from '../../../hooks/useShopFilterOptions';
import { getActiveFiltersCount, getFilterChips } from '../side-filters.utils.ts';
import { useStoreConfiguration } from '../../../context/StoreConfigurationContext.tsx';
import styles from './side-filters.module.scss';
import { useUrlFilters } from '../../../hooks/useUrlFilters.ts';
import { type ShopFilters, urlFilterParsers } from './side-filters.utils.ts';
import { useDebounce } from '@baby-toys/ui-kit/hooks';

type SideFiltersProps = {
  className?: string;
  onFiltersChange: (filters: ShopFilters) => void;
  categoriesOptions?: RadioOption[];
};

export const SideFilters: React.FC<SideFiltersProps> = ({
  className,
  onFiltersChange,
  categoriesOptions = [],
}) => {
  const { currency } = useStoreConfiguration();
  const {
    colors,
    brands,
    materials,
    priceRange,
    defaultPriceRange,
    loading: filterLoading,
  } = useShopFilterOptions();

  const defaultFilters: ShopFilters = {
    category: undefined,
    brand: undefined,
    color: undefined,
    material: undefined,
    priceRange: defaultPriceRange,
  };

  const { urlFilters, updateUrlFilters } = useUrlFilters<ShopFilters>(
    urlFilterParsers,
    defaultFilters
  );

  const debouncedFilters = useDebounce(urlFilters, 400);

  useEffect(() => {
    if (!filterLoading) {
      onFiltersChange(debouncedFilters);
    }
  }, [debouncedFilters, onFiltersChange]);

  const handleFilterChange = (key: keyof ShopFilters, value: any) => {
    updateUrlFilters({ [key]: value });
  };

  const clearFilters = () => {
    updateUrlFilters({
      category: undefined,
      brand: undefined,
      color: undefined,
      material: undefined,
      priceRange: defaultPriceRange,
    });
  };

  const removeFilter = (key: keyof ShopFilters) => {
    if (key === 'priceRange') {
      handleFilterChange(key, defaultPriceRange);
    } else {
      handleFilterChange(key, undefined);
    }
  };

  const filtersCount = getActiveFiltersCount(urlFilters, defaultFilters);

  if (filterLoading) {
    return (
      <Card className={className} header="Filters">
        <BouncingDotsLoader size="medium" />
      </Card>
    );
  }

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
              withoutHeaderPadding
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
          {getFilterChips(urlFilters, currency?.symbol || '', defaultFilters).map(
            ({ key, label }) => (
              <Chip
                key={key}
                appearance="secondary-outline"
                label={label}
                onClose={() => removeFilter(key)}
              />
            )
          )}
          {filtersCount < 1 && (
            <NoDataFound
              subtext="No filters applied"
              align="start"
              withoutPadding
              withoutHeaderPadding
            />
          )}
        </Flex>

        <Divider className="bts-marginTxl" />

        <Accordion header="Category" withoutPadding withoutHeaderPadding>
          <RadioButtonGroup
            name="category"
            selectedValue={urlFilters.category}
            onChange={(val) => handleFilterChange('category', val)}
            direction="vertical"
            align="start"
            spacing="l"
            className="bts-marginTm"
          >
            {categoriesOptions.map(({ label, value }) => (
              <RadioButton key={value} value={value}>
                {label}
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </Accordion>

        <Accordion header="Color" withoutPadding withoutHeaderPadding>
          <RadioButtonGroup
            name="color"
            selectedValue={urlFilters.color}
            onChange={(val) => handleFilterChange('color', val)}
            direction="horizontal"
            align="start"
            spacing="l"
            appearance="color-swatch"
            className="bts-marginTm"
          >
            <RadioButton key="multi" value="multi" name="color" isRainbow />
            {colors.map(({ value }) => (
              <RadioButton key={value} value={value} name="color" swatchColor={value} />
            ))}
          </RadioButtonGroup>
        </Accordion>

        <Accordion header="Brand" withoutPadding withoutHeaderPadding>
          <RadioButtonGroup
            name="brand"
            selectedValue={urlFilters.brand}
            onChange={(val) => handleFilterChange('brand', val)}
            direction="vertical"
            spacing="l"
            align="start"
            className="bts-marginTm"
          >
            {brands.map(({ label, value }) => (
              <RadioButton key={value} value={value}>
                {label}
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </Accordion>

        <Accordion header="Material" withoutPadding withoutHeaderPadding>
          <RadioButtonGroup
            name="material"
            selectedValue={urlFilters.material}
            onChange={(val) => handleFilterChange('material', val)}
            direction="vertical"
            spacing="l"
            align="start"
            className="bts-marginTm"
          >
            {materials.map(({ label, value }) => (
              <RadioButton key={value} value={value}>
                {label}
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </Accordion>

        <Accordion header="Price" withoutPadding withoutHeaderPadding>
          <Slider
            min={priceRange?.[0]}
            max={priceRange?.[1]}
            step={1}
            range
            value={urlFilters.priceRange || defaultPriceRange}
            className="bts-marginTxxl"
            onChange={(val: [number, number]) => handleFilterChange('priceRange', val)}
          />
        </Accordion>
      </Flex>
    </Card>
  );
};
