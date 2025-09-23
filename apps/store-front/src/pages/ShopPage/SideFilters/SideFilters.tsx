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
  Drawer,
} from '@baby-toys/ui-kit';
import { useShopFilterOptions } from '../../../hooks/useShopFilterOptions';
import { useFilterChips } from '../shop-page.utils.ts';
import styles from './side-filters.module.scss';
import { useUrlFilters } from '../../../hooks/useUrlFilters.ts';
import { type ShopFilters, urlFilterParsers } from './side-filters.utils.ts';
import { useDebounce } from '@baby-toys/ui-kit/hooks';
import type { Category } from '@baby-toys/types';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

export const SideFilters: React.FC<{
  className?: string;
  onFiltersChange: (filters: ShopFilters) => void;
  categoriesOptions?: Category[];
  isDrawer?: boolean;
}> = ({ className, onFiltersChange, categoriesOptions = [], isDrawer = false }) => {
  const {
    colors,
    brands,
    materials,
    defaultPriceRange,
    loading: filterLoading,
  } = useShopFilterOptions();

  const defaultFilters: ShopFilters = {
    categoryId: undefined,
    brandId: undefined,
    colorId: undefined,
    materialId: undefined,
    priceRange: defaultPriceRange,
  };

  const { urlFilters, updateUrlFilters } = useUrlFilters<ShopFilters>(
    urlFilterParsers,
    defaultFilters
  );

  const filterChips = useFilterChips(urlFilters, defaultFilters);
  const filtersCount = filterChips.length;
  const debouncedFilters = useDebounce(urlFilters, 400);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  useEffect(() => {
    if (!filterLoading) {
      onFiltersChange(debouncedFilters);
    }
  }, [debouncedFilters, onFiltersChange]);

  const handleFilterChange = (key: keyof ShopFilters, value: any) => {
    updateUrlFilters({ [key]: value });
  };

  const clearFilters = () => {
    updateUrlFilters({ ...defaultFilters });
  };

  const removeFilter = (key: keyof ShopFilters) => {
    if (key === 'priceRange') {
      handleFilterChange(key, defaultPriceRange);
    } else {
      handleFilterChange(key, undefined);
    }
  };

  const content = (
    <Flex direction="vertical" spacing="m" fullWidth>
      <Flex wrap spacing="m" fullWidth className={styles.sideFilterChipsContainer}>
        {filterChips.map(({ key, label }) => (
          <Chip
            key={key}
            appearance="secondary-outline"
            label={label}
            onClose={() => removeFilter(key)}
          />
        ))}
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
          selectedValue={urlFilters.categoryId}
          onChange={(val) => handleFilterChange('categoryId', val)}
          direction="vertical"
          align="start"
          spacing="l"
          className="bts-marginTm"
        >
          {categoriesOptions.map(({ name, id }) => (
            <RadioButton key={id} value={id}>
              {name}
            </RadioButton>
          ))}
        </RadioButtonGroup>
      </Accordion>

      <Accordion header="Color" withoutPadding withoutHeaderPadding>
        <RadioButtonGroup
          name="color"
          selectedValue={urlFilters.colorId}
          onChange={(val) => handleFilterChange('colorId', val)}
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
          selectedValue={urlFilters.brandId}
          onChange={(val) => handleFilterChange('brandId', val)}
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
          selectedValue={urlFilters.materialId}
          onChange={(val) => handleFilterChange('materialId', val)}
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
          min={defaultPriceRange?.[0]}
          max={defaultPriceRange?.[1]}
          step={1}
          range
          value={urlFilters.priceRange || defaultPriceRange}
          className="bts-marginTxxl"
          onChange={(val: [number, number]) => handleFilterChange('priceRange', val)}
        />
      </Accordion>
    </Flex>
  );

  if (filterLoading) {
    return (
      <Card className={className} header="Filters">
        <BouncingDotsLoader size="medium" />
      </Card>
    );
  }

  if (isDrawer) {
    return (
      <>
        <div className={className}>
          <Button
            appearance="link"
            color="secondary"
            size="xlarge"
            leftIcon={faFilter}
            withoutPadding
            isSelected={filtersCount > 0}
            iconBadge={filtersCount}
            onClick={() => setIsDrawerOpen(true)}
          />
        </div>
        <Drawer
          visible={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          position="right"
          appendTo={document.body}
          header={<span>Filters ({filtersCount})</span>}
        >
          {content}
        </Drawer>
      </>
    );
  }

  return (
    <Card
      header={
        <Flex justify="between" align="center" fullWidth spacing="l">
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
      {content}
    </Card>
  );
};
