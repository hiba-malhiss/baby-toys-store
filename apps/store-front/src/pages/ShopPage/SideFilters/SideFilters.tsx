import React, { useEffect, useMemo, useState } from 'react';
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
  ExpandableContent,
} from '@baby-toys/ui-kit';
import { useDebounce } from '@baby-toys/ui-kit/hooks';
import { Filter } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useUrlFilters } from '../../../hooks/useUrlFilters';
import { type ShopFilters, urlFilterParsers } from './side-filters.utils';
import { useCategories, useFilterableAttributes } from '../../../api/catalogApi';
import { useStoreSettings } from '../../../api/settingsApi';
import { useFilterChips } from '../useFilterChips';

import styles from './side-filters.module.scss';
import { parseAttributeFilters } from '../../../utils/filters.utils.ts';

type Props = {
  className?: string;
  onFiltersChange: (filters: ShopFilters) => void;
  isDrawer?: boolean;
};

export const SideFilters: React.FC<Props> = ({ className, onFiltersChange, isDrawer = false }) => {
  const { t } = useTranslation('common');

  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: attributeTypes = [], isLoading: loadingAttributes } = useFilterableAttributes();
  const { data: settings } = useStoreSettings();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const priceRange: [number, number] = useMemo(
    () => [
      Number(settings?.general?.priceRangeMin ?? 0),
      Number(settings?.general?.priceRangeMax ?? 300),
    ],
    [settings]
  );

  const defaultFilters: ShopFilters = useMemo(
    () => ({
      priceRange,
    }),
    [priceRange]
  );

  const { urlFilters, updateUrlFilters } = useUrlFilters<ShopFilters>(
    urlFilterParsers,
    defaultFilters
  );

  const debouncedFilters = useDebounce(urlFilters, 400);
  const filterChips = useFilterChips(urlFilters, defaultFilters);
  const filtersCount = filterChips.length;

  const isLoadingFilters = loadingCategories || loadingAttributes;

  useEffect(() => {
    if (!isLoadingFilters) {
      onFiltersChange(debouncedFilters);
    }
  }, [debouncedFilters, isLoadingFilters, onFiltersChange]);

  const handleFilterChange = <K extends keyof ShopFilters>(key: K, value: ShopFilters[K]) => {
    const current = urlFilters[key];
    const next = current === value ? undefined : value;
    updateUrlFilters({ [key]: next });
  };

  const clearFilters = () => {
    updateUrlFilters(defaultFilters);
  };

  const { selectedAttrs } = useMemo(() => parseAttributeFilters(urlFilters), [urlFilters]);

  const updateAttributeSelection = (typeId: number, valueId?: number) => {
    const key = `attr_${typeId}`;
    const current = selectedAttrs[String(typeId)] ?? [];

    if (!valueId || (current.length === 1 && current[0] === valueId)) {
      updateUrlFilters({ [key]: undefined });
      return;
    }

    updateUrlFilters({ [key]: String(valueId) });
  };

  const removeFilter = (key: string) => {
    if (key.startsWith('attr_')) {
      updateUrlFilters({ [key]: undefined });
      return;
    }

    if (key === 'priceRange') return handleFilterChange('priceRange', priceRange);
    return handleFilterChange('categoryId', undefined);
  };

  const renderFilterChips = () => (
    <Flex wrap spacing="m" fullWidth className={styles.sideFilterChipsContainer}>
      {filterChips.map(({ key, label }) => (
        <Chip
          key={key}
          appearance="secondary-outline"
          label={label}
          onClose={() => removeFilter(key)}
        />
      ))}

      {filtersCount === 0 && (
        <NoDataFound subtext={t('filters.none')} align="start" withoutPadding />
      )}
    </Flex>
  );

  const renderContent = () => (
    <Flex direction="vertical" spacing="l" fullWidth>
      {renderFilterChips()}
      <Divider className="bts-marginTxl" />

      <Accordion
        header={<span key="sf-header-category">{t('filters.category')}</span>}
        withoutPadding
        withoutHeaderPadding
        isOpenByDefault
      >
        <ExpandableContent maxHeight="220px">
          <RadioButtonGroup
            name="category"
            selectedValue={urlFilters.categoryId}
            onChange={(val) => handleFilterChange('categoryId', val)}
            direction="vertical"
            spacing="s"
            align="start"
            className="bts-marginTm"
          >
            {categories.map(({ id, name }) => (
              <RadioButton key={`sf-cat-${id}`} value={String(id)}>
                <span key={`sf-cat-label-${id}`}>{name}</span>
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </ExpandableContent>
      </Accordion>

      {attributeTypes.map((type) => (
        <Accordion
          key={`sf-attr-${type.id}`}
          header={<span key={`sf-attr-header-${type.id}`}>{type.displayName}</span>}
          withoutPadding
          withoutHeaderPadding
        >
          <ExpandableContent maxHeight="220px">
            <RadioButtonGroup
              name={`attr-${type.id}`}
              selectedValue={String(selectedAttrs[String(type.id)]?.[0] ?? '')}
              onChange={(val) => updateAttributeSelection(type.id, val ? Number(val) : undefined)}
              direction="vertical"
              spacing="s"
              align="start"
              className="bts-marginTm"
            >
              {type.values.map((v) => (
                <RadioButton key={`attr-${type.id}-val-${v.id}`} value={String(v.id)}>
                  <span key={`${type.id}-val-${v.id}`}>{v.displayValue}</span>
                </RadioButton>
              ))}
            </RadioButtonGroup>
          </ExpandableContent>
        </Accordion>
      ))}

      <Accordion
        header={<span key="sf-header-deals">{t('filters.dealsAndDiscounts')}</span>}
        withoutPadding
        withoutHeaderPadding
      >
        <ExpandableContent maxHeight="220px">
          <RadioButtonGroup
            name="discounts"
            selectedValue={urlFilters.discounts}
            onChange={(val) => handleFilterChange('discounts', val)}
            direction="vertical"
            spacing="s"
            align="start"
            className="bts-marginTm"
          >
            <RadioButton value="discounts">
              {t('filters.discounts', { defaultValue: 'Discounts' })}
            </RadioButton>
          </RadioButtonGroup>
        </ExpandableContent>
      </Accordion>

      <Accordion
        header={<span key="sf-header-price">{t('filters.price')}</span>}
        withoutPadding
        withoutHeaderPadding
      >
        <ExpandableContent maxHeight="120px">
          <Slider
            min={priceRange[0]}
            max={priceRange[1]}
            step={1}
            range
            value={urlFilters.priceRange || priceRange}
            className={clsx(styles.sideFilterPriceSlider, 'bts-marginTxxxl')}
            onChange={(val: [number, number]) => handleFilterChange('priceRange', val)}
          />
        </ExpandableContent>
      </Accordion>
    </Flex>
  );

  if (isLoadingFilters) {
    return (
      <Card className={className} header={t('filters.header')} withoutBorder size="xsmall">
        <BouncingDotsLoader size="medium" className="bts-marginTl" />
      </Card>
    );
  }

  if (isDrawer) {
    return (
      <>
        <div className={className}>
          <Button
            appearance="link"
            color="icon"
            size="xlarge"
            leftIconComp={Filter}
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
          {renderContent()}
        </Drawer>
      </>
    );
  }

  return (
    <Card
      className={className}
      header={
        <Flex justify="between" align="center" fullWidth spacing="s">
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
    >
      {renderContent()}
    </Card>
  );
};
