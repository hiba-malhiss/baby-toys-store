import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '../../../components/features/Section/Section.tsx';
import { Flex, Button, RadioButtonGroup } from '@baby-toys/ui-kit';
import styles from './top-picks-section.module.scss';
import SmartProductCard from '../../../components/features/SmartProductCard/SmartProductCard.tsx';
import { useTopPicks } from '../../../api/productApi';

import { HOMEPAGE_TOP_PICKS_LIMIT } from '../../../constants/display.constants.ts';
import {
  DEFAULT_SORT_OPTION,
  TOP_PICS_SORT_OPTIONS,
} from '../../../constants/filters.constants.ts';

const TopPicksSection = () => {
  const [selected, setSelected] = useState(DEFAULT_SORT_OPTION);
  const navigate = useNavigate();
  const { data: items = [], isLoading } = useTopPicks(selected as any, HOMEPAGE_TOP_PICKS_LIMIT);

  const handleSortChange = useCallback((val: string) => {
    setSelected(val);
  }, []);

  const handleViewAll = useCallback(() => {
    navigate(`/shop?sortBy=${encodeURIComponent(selected)}`);
  }, [navigate, selected]);

  return (
    <Section title="Top picks for your little ones" isLoading={isLoading}>
      <RadioButtonGroup
        className={styles.topPicks}
        options={TOP_PICS_SORT_OPTIONS}
        selectedValue={selected}
        name="topPicks"
        onChange={handleSortChange}
        appearance="chip"
      />
      <div className={styles.topPicksGrid}>
        {items.map((toy, index) => (
          <SmartProductCard key={toy.id || `product-${index}`} product={toy} />
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
