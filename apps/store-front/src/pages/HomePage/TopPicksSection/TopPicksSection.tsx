import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '../../../components/features/Section/Section.tsx';
import { Flex, Button, RadioButtonGroup } from '@baby-toys/ui-kit/components';
import styles from './top-picks-section.module.scss';
import SmartProductCard from '../../../components/features/SmartProductCard/SmartProductCard.tsx';
import { useMockProductsApi } from '@mock-data/useMockApi';
import type { Product } from '../../../types/product.types.ts';

import { HOMEPAGE_TOP_PICKS_LIMIT } from '../../../constants/display.constants.ts';
import { TOP_PICS_SORT_OPTIONS } from '../../../constants/filters.constants.ts';

const TopPicksSection = () => {
  const [selected, setSelected] = useState('featured');
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { fetchProducts } = useMockProductsApi(HOMEPAGE_TOP_PICKS_LIMIT);

  useEffect(() => {
    if (!selected) return;

    setLoading(true);
    fetchProducts(1, { sortBy: selected })
      .then(({ items }) => {
        setItems(items);
      })
      .catch((error) => {
        console.error('Error fetching top picks:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selected, fetchProducts]);

  const handleSortChange = useCallback((val: string) => {
    setSelected(val);
  }, []);

  const handleViewAll = useCallback(() => {
    // Navigate to shop page with the selected sort filter
    navigate(`/shop?sortBy=${selected}`);
  }, [navigate, selected]);

  return (
    <Section title="Top picks for your little ones" isLoading={loading}>
      <RadioButtonGroup
        className={styles.topPicks}
        options={TOP_PICS_SORT_OPTIONS}
        selectedValue={selected}
        name="topPicks"
        onChange={handleSortChange}
        appearance="secondary"
      />
      <div className={styles.topPicksGrid}>
        {items.map((toy, index) => (
          <SmartProductCard key={toy.id || `product-${toy.label}-${index}`} product={toy} />
        ))}
      </div>
      <Flex justify="center" className="bts-marginTxxxl">
        <Button appearance="outline" color="primary" size="large" onClick={handleViewAll}>
          View All {TOP_PICS_SORT_OPTIONS.find((opt) => opt.value === selected)?.label}
        </Button>
      </Flex>
    </Section>
  );
};

export default TopPicksSection;
