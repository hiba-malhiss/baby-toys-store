import React, { useEffect, useRef } from 'react';
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
import { NoDataFound } from '../../../components/common/NoDataFound';
import BouncingDotsLoader from '../../../components/common/BouncingDotsLoader/BouncingDotsLoader';
import { useUrlFilters } from '../../../hooks/useUrlFilters.ts';
import { type ShopFilters, urlFilterParsers } from './side-filters.utils.ts';

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
    priceRange: defaultPriceRange ?? [0, 1000],
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
      handleFilterChange(key, defaultPriceRange ?? [0, 1000]);
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
            <NoDataFound subtext="No filters applied" align="start" withoutPadding />
          )}
        </Flex>

        <Divider className="bts-marginTxl" />

        <Accordion header="Category" withoutPadding>
          <RadioButtonGroup
            name="category"
            selectedValue={urlFilters.category}
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
            selectedValue={urlFilters.color}
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
            selectedValue={urlFilters.brand}
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
            selectedValue={urlFilters.material}
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
            min={priceRange ? priceRange[0] : 0}
            max={priceRange ? priceRange[1] : 1000}
            step={1}
            range
            value={urlFilters.priceRange || (defaultPriceRange ?? [0, 1000])}
            className="bts-marginTxl"
            onChange={(val: [number, number]) => handleFilterChange('priceRange', val)}
          />
        </Accordion>
      </Flex>
    </Card>
  );
};
