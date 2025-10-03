import React, { useEffect } from 'react';
import { Select, Option } from '@baby-toys/ui-kit';
import styles from './shop-page.module.scss';
import { DEFAULT_SORT_OPTION, SORT_OPTIONS } from '../../constants/filters.constants.ts';
import { useUrlFilters } from '../../hooks/useUrlFilters'; // adjust path as needed
import { useTranslation } from 'react-i18next';

interface SortProductsProps {
  onSort?: (value: string) => void;
}

const parsers = {
  sortBy: (val: string) => val,
};
export const SortProductsWithUrl: React.FC<SortProductsProps> = ({ onSort }) => {
  const { urlFilters, updateUrlFilters } = useUrlFilters(
    parsers,
    {
      sortBy: DEFAULT_SORT_OPTION,
    },
    ['sortBy']
  );

  const { sortBy } = urlFilters;
  const { t } = useTranslation('common');

  useEffect(() => {
    if (sortBy) {
      onSort?.(sortBy);
    }
  }, [sortBy, onSort]);

  const handleSortChange = (value: string) => {
    if (value === DEFAULT_SORT_OPTION) {
      updateUrlFilters({ sortBy: undefined });
    } else {
      updateUrlFilters({ sortBy: value });
    }
  };

  return (
    <Select
      value={sortBy}
      onChange={(val) => handleSortChange(val as string)}
      placeholder={t('shop.sortBy')}
      className={styles.shopPageSelect}
    >
      {SORT_OPTIONS.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {t(`shop.sort.${opt.value}`, { defaultValue: opt.label })}
        </Option>
      ))}
    </Select>
  );
};
