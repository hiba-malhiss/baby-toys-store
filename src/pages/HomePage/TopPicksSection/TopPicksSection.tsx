import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '../../../components/layout/Section/Section.tsx';
import RadioButtonGroup from '../../../components/common/RadioButtonGroup/RadioButtonGroup.tsx';
import styles from './top-picks-section.module.scss';
import SmartProductCard from '../../../components/smart/SmartProductCard/SmartProductCard.tsx';
import { Button } from '../../../components/common/Button/Button.tsx';
import { useMockProductsApi } from '../../../mock-data/useMockProductsApi.ts';
import type { Product } from '../../../types/product.types.ts';
import Flex from '../../../components/common/Flex/Flex.tsx';

import { HOMEPAGE_TOP_PICKS_LIMIT } from '../../../constants/display.constants.ts';

const TopPicksSection = () => {
  const [topPicksOptions, setTopPicksOptions] = useState([]);
  const [selected, setSelected] = useState('');
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const navigate = useNavigate();

  const { fetchProducts, getHomepageContent } =
    useMockProductsApi<Product>(HOMEPAGE_TOP_PICKS_LIMIT);

  useEffect(() => {
    getHomepageContent()
      .then(({ topPicksOptions }) => {
        setTopPicksOptions(topPicksOptions);
        setSelected(topPicksOptions[0]?.value || '');
      })
      .catch((error) => {
        console.error('Error fetching homepage content:', error);
      })
      .finally(() => {
        setOptionsLoading(false);
      });
  }, [getHomepageContent]);

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
    <Section title="Top picks for your little ones" isLoading={optionsLoading || loading}>
      <RadioButtonGroup
        className={styles.topPicks}
        options={topPicksOptions}
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
          View All {topPicksOptions.find((opt) => opt.value === selected)?.label}
        </Button>
      </Flex>
    </Section>
  );
};

export default TopPicksSection;
