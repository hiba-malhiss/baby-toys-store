import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CheckboxGroup,
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
import { parseAttributeFilters, type ShopFilters, urlFilterParsers } from './side-filters.utils';
import { useCategories, useFilterableAttributes } from '../../../api/catalogApi';
import { useStoreSettings } from '../../../api/settingsApi';
import { useFilterChips } from '../useFilterChips';

import styles from './side-filters.module.scss';

type Props = {
  className?: string;
  onFiltersChange: (filters: Record<string, any>) => void;
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
      categoryIds: undefined,
      discounts: undefined,
    }),
    [priceRange]
  );

  const { urlFilters, updateUrlFilters, clearFilters } = useUrlFilters<ShopFilters>(
    urlFilterParsers,
    defaultFilters,
    undefined,
    [
      {
        prefix: 'attr_',
        parser: (v: string) =>
          v
            .split(',')
            .map(Number)
            .filter((n) => !isNaN(n)),
      },
    ]
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
    updateUrlFilters({ [key]: value });
  };

  const { selectedAttrs } = useMemo(() => parseAttributeFilters(urlFilters), [urlFilters]);

  const updateAttributeSelection = (typeId: number, valueIds?: number[]) => {
    const key = `attr_${typeId}`;

    updateUrlFilters({
      [key]: valueIds && valueIds.length > 0 ? valueIds : undefined,
    });
  };

  const removeFilter = (key: string) => {
    if (key.startsWith('attr_')) {
      const [, typeId, valueId] = key.split('_');
      const current = selectedAttrs[typeId] || [];
      const next = current.filter((v) => v !== Number(valueId));
      updateAttributeSelection(Number(typeId), next);
      return;
    }

    if (key.startsWith('categoryIds')) {
      const [, categoryId] = key.split('_');
      const current = urlFilters.categoryIds || [];
      const next = current.filter((id) => id !== categoryId);
      handleFilterChange('categoryIds', next.length > 0 ? next : undefined);
      return;
    }

    if (key === 'priceRange') {
      handleFilterChange('priceRange', priceRange);
      return;
    }

    handleFilterChange(key as keyof ShopFilters, undefined);
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
    <Flex direction="vertical" spacing="s" fullWidth>
      {renderFilterChips()}
      <Divider className="bts-marginTxl" />

      {/* Categories */}
      <Accordion
        header={<span>{t('filters.category')}</span>}
        withoutPadding
        withoutHeaderPadding
        isOpenByDefault
        size="medium"
      >
        <ExpandableContent maxHeight="220px" className="bts-marginBxs">
          <CheckboxGroup
            options={categories.map(({ id, name }) => ({
              label: name,
              value: String(id),
            }))}
            value={urlFilters.categoryIds || []}
            onChange={(val) => handleFilterChange('categoryIds', val.length > 0 ? val : undefined)}
            direction="vertical"
          />
        </ExpandableContent>
      </Accordion>

      {/* Attributes */}
      {attributeTypes.map((type) => (
        <Accordion
          key={`sf-attr-${type.id}`}
          header={<span>{type.displayName}</span>}
          withoutPadding
          withoutHeaderPadding
          size="medium"
        >
          <ExpandableContent maxHeight="220px" className="bts-marginBxs">
            <CheckboxGroup
              options={type.values.map((v) => ({
                label: v.displayValue,
                value: String(v.id),
              }))}
              value={selectedAttrs[String(type.id)]?.map(String) || []}
              onChange={(values) =>
                updateAttributeSelection(
                  type.id,
                  values.length > 0 ? values.map(Number) : undefined
                )
              }
              direction="vertical"
            />
          </ExpandableContent>
        </Accordion>
      ))}

      {/* Discounts */}
      <Accordion
        header={<span>{t('filters.dealsAndDiscounts')}</span>}
        withoutPadding
        withoutHeaderPadding
        size="medium"
      >
        <ExpandableContent maxHeight="220px" className="bts-marginBxs">
          <CheckboxGroup
            options={[
              {
                label: t('filters.discounts', {
                  defaultValue: 'Discounts',
                }),
                value: 'discounts',
              },
            ]}
            value={urlFilters.discounts ? ['discounts'] : []}
            onChange={(val) =>
              handleFilterChange('discounts', val.length > 0 ? 'discounts' : undefined)
            }
            direction="vertical"
          />
        </ExpandableContent>
      </Accordion>

      {/* Price */}
      <Accordion
        header={<span>{t('filters.price')}</span>}
        withoutPadding
        withoutHeaderPadding
        size="medium"
      >
        <ExpandableContent maxHeight="120px" className="bts-marginBxs">
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
          header={
            <span>
              {t('filters.headerWithCount', {
                count: filtersCount,
              })}
            </span>
          }
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
              ? t('filters.headerWithCount', {
                  count: filtersCount,
                })
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
