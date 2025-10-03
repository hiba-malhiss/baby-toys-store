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
import { useFilterChips } from '../shop-page.utils.ts';
import styles from './side-filters.module.scss';
import { useUrlFilters } from '../../../hooks/useUrlFilters.ts';
import { type ShopFilters, urlFilterParsers } from './side-filters.utils.ts';
import { useDebounce } from '@baby-toys/ui-kit/hooks';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { useBrands, useCategories, useColors, useMaterials } from '../../../api/catalogApi.ts';
import { useStoreSettings } from '../../../api/settingsApi';
import { useTranslation } from 'react-i18next';

export const SideFilters: React.FC<{
  className?: string;
  onFiltersChange: (filters: ShopFilters) => void;
  isDrawer?: boolean;
}> = ({ className, onFiltersChange, isDrawer = false }) => {
  const { t } = useTranslation('common');
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: brands = [], isLoading: loadingBrands } = useBrands();
  const { data: colors = [], isLoading: loadingColors } = useColors();
  const { data: materials = [], isLoading: loadingMaterials } = useMaterials();
  const { data: settings } = useStoreSettings();
  const priceRange: [number, number] = [
    Number(settings?.general?.priceRangeMin ?? 0),
    Number(settings?.general?.priceRangeMax ?? 0),
  ];

  const defaultFilters: ShopFilters = {
    categoryId: undefined,
    brandId: undefined,
    colorId: undefined,
    materialId: undefined,
    priceRange: priceRange,
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
    const filterLoading = loadingCategories || loadingBrands || loadingColors || loadingMaterials;
    if (!filterLoading) {
      onFiltersChange(debouncedFilters);
    }
  }, [
    debouncedFilters,
    onFiltersChange,
    loadingCategories,
    loadingBrands,
    loadingColors,
    loadingMaterials,
  ]);

  const handleFilterChange = (key: keyof ShopFilters, value: any) => {
    updateUrlFilters({ [key]: value });
  };

  const clearFilters = () => {
    updateUrlFilters({ ...defaultFilters });
  };

  const removeFilter = (key: keyof ShopFilters) => {
    if (key === 'priceRange') {
      handleFilterChange(key, priceRange);
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
            subtext={t('filters.none')}
            align="start"
            withoutPadding
            withoutHeaderPadding
          />
        )}
      </Flex>

      <Divider className="bts-marginTxl" />

      <Accordion header={t('filters.category')} withoutPadding withoutHeaderPadding>
        <RadioButtonGroup
          name="category"
          selectedValue={urlFilters.categoryId}
          onChange={(val) => handleFilterChange('categoryId', val)}
          direction="vertical"
          align="start"
          spacing="l"
          className="bts-marginTm"
        >
          {categories.map(({ name, id }) => (
            <RadioButton key={id} value={String(id)}>
              {name}
            </RadioButton>
          ))}
        </RadioButtonGroup>
      </Accordion>

      <Accordion header={t('filters.color')} withoutPadding withoutHeaderPadding>
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
          {colors.map(({ id, code }) => (
            <RadioButton key={id} value={String(id)} name="color" swatchColor={code} />
          ))}
        </RadioButtonGroup>
      </Accordion>

      <Accordion header={t('filters.brand')} withoutPadding withoutHeaderPadding>
        <RadioButtonGroup
          name="brand"
          selectedValue={urlFilters.brandId}
          onChange={(val) => handleFilterChange('brandId', val)}
          direction="vertical"
          spacing="l"
          align="start"
          className="bts-marginTm"
        >
          {brands.map(({ id, name }) => (
            <RadioButton key={id} value={String(id)}>
              {name}
            </RadioButton>
          ))}
        </RadioButtonGroup>
      </Accordion>

      <Accordion header={t('filters.material')} withoutPadding withoutHeaderPadding>
        <RadioButtonGroup
          name="material"
          selectedValue={urlFilters.materialId}
          onChange={(val) => handleFilterChange('materialId', val)}
          direction="vertical"
          spacing="l"
          align="start"
          className="bts-marginTm"
        >
          {materials.map(({ id, name }) => (
            <RadioButton key={id} value={String(id)}>
              {name}
            </RadioButton>
          ))}
        </RadioButtonGroup>
      </Accordion>

      <Accordion header={t('filters.price')} withoutPadding withoutHeaderPadding>
        <Slider
          min={priceRange?.[0]}
          max={priceRange?.[1]}
          step={1}
          range
          value={urlFilters.priceRange || priceRange}
          className="bts-marginTxxl"
          onChange={(val: [number, number]) => handleFilterChange('priceRange', val)}
        />
      </Accordion>
    </Flex>
  );

  const isLoadingFilters = loadingCategories || loadingBrands || loadingColors || loadingMaterials;
  if (isLoadingFilters) {
    return (
      <Card className={className} header={t('filters.header')}>
        <BouncingDotsLoader />
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
          header={<span>{t('filters.headerWithCount', { count: filtersCount })}</span>}
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
          <span>
            {filtersCount > 0
              ? t('filters.headerWithCount', { count: filtersCount })
              : t('filters.header')}
          </span>
          {filtersCount > 0 && (
            <Button
              appearance="link"
              color="highlighted"
              size="xsmall"
              onClick={clearFilters}
              withoutPadding
            >
              {t('filters.clear')}
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
