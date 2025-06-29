import { useEffect, useState } from 'react';
import { Select } from '../../components/common/Select/Select.tsx';
import { Option } from '../../components/common/Select/Option.tsx';
import styles from './shop-page.module.scss';
import { DEFAULT_SORT_OPTION, SORT_OPTIONS } from '../../constants/filters.constants.ts';

export const SortProducts: React.FC<{
  selected?: string;
  onSort?: (sortOption: string) => void;
}> = ({ selected, onSort }) => {
  const [sortBy, setSortBy] = useState<string>(selected || DEFAULT_SORT_OPTION);

  // Keep local state in sync with prop
  useEffect(() => {
    if (selected && selected !== sortBy) setSortBy(selected);
  }, [selected]);

  const handleSortChange = (selected: string) => {
    setSortBy(selected);
    onSort?.(selected);
  };

  return (
    <Select
      value={sortBy}
      onChange={(value) => handleSortChange(value as string)}
      placeholder="Sort by"
      className={styles.shopPageSelect}
    >
      {SORT_OPTIONS.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </Select>
  );
};
