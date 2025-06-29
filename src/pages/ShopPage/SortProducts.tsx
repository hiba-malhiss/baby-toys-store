import { useEffect, useState } from 'react';
import { Select } from '../../components/common/Select/Select.tsx';
import { Option } from '../../components/common/Select/Option.tsx';
import styles from './shop-page.module.scss';

// Add all top picks options
export const SortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Best Seller', value: 'best_seller' },
  { label: 'New Arrivals', value: 'new_arrivals' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
];

export const SortProducts: React.FC<{
  selected?: string;
  onSort?: (sortOption: string) => void;
}> = ({ selected, onSort }) => {
  const [sortBy, setSortBy] = useState<string>(selected || 'featured');

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
      {SortOptions.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </Select>
  );
};
