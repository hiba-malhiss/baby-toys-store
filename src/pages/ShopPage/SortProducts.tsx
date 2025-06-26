import { useState } from 'react';
import { Select } from '../../components/common/Select/Select.tsx';
import { Option } from '../../components/common/Select/Option.tsx';
import styles from './shop-page.module.scss';

type SortOption = 'price-low-high' | 'price-high-low' | 'rating';

const sortOptions = [
  { label: 'Price: Low to High', value: 'price-low-high' },
  { label: 'Price: High to Low', value: 'price-high-low' },
  { label: 'Rating', value: 'rating' },
];

export const SortProducts: React.FC<{
  onSort?: (sortOption: SortOption) => void;
}> = ({ onSort }) => {
  const [sortBy, setSortBy] = useState<SortOption>('price-low-high');

  const handleSortChange = (selected: SortOption) => {
    setSortBy(selected);
    onSort?.(selected);
  };

  return (
    <Select
      value={sortBy}
      onChange={handleSortChange}
      placeholder="Sort by"
      className={styles.shopPageSelect}
    >
      {sortOptions.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </Select>
  );
};
