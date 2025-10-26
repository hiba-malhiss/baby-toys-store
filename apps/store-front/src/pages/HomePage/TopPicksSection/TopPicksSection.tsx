import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '../../../components/features/Section/Section.tsx';
import { Flex, Button, RadioButtonGroup, SkeletonProductCard } from '@baby-toys/ui-kit';
import styles from './top-picks-section.module.scss';
import SmartProductCard from '../../../components/features/SmartProductCard/SmartProductCard.tsx';
import { useTopPicks } from '../../../api/productApi';
import { useTranslation } from 'react-i18next';

import { HOMEPAGE_TOP_PICKS_LIMIT } from '../../../constants/display.constants.ts';
import {
  DEFAULT_SORT_OPTION,
  TOP_PICS_SORT_OPTIONS,
} from '../../../constants/filters.constants.ts';

const TopPicksSection = () => {
  const [selected, setSelected] = useState(DEFAULT_SORT_OPTION);
  const navigate = useNavigate();
  const { data: items = [], isLoading } = useTopPicks(selected as any, HOMEPAGE_TOP_PICKS_LIMIT);
  const { t } = useTranslation('common');

  const handleSortChange = useCallback((val: string) => {
    setSelected(val);
  }, []);

  const handleViewAll = useCallback(() => {
    navigate(`/shop?sortBy=${encodeURIComponent(selected)}`);
  }, [navigate, selected]);

  return (
    <Section title={t('home.topPicks.title')}>
      <RadioButtonGroup
        className={styles.topPicks}
        options={TOP_PICS_SORT_OPTIONS.map((opt) => ({
          ...opt,
          label: t(`shop.sort.${opt.value}`, { defaultValue: opt.label }),
        }))}
        selectedValue={selected}
        name="topPicks"
        onChange={handleSortChange}
        appearance="chip"
        justify="center"
      />
      <div className={styles.topPicksGrid}>
        {items.map((toy, index) => (
          <SmartProductCard key={toy.id || `product-${index}`} product={toy} />
        ))}
        {!items.length &&
          Array.from({ length: 9 }).map((_, i) => (
            <React.Fragment key={`skeleton-${i}`}>
              <SkeletonProductCard fullWidth />
            </React.Fragment>
          ))}
      </div>
      <Flex justify="center">
        <Button appearance="outline" color="primary" size="large" onClick={handleViewAll}>
          {t('home.topPicks.viewAll', {
            label: t(`shop.sort.${selected}`, {
              defaultValue: TOP_PICS_SORT_OPTIONS.find((opt) => opt.value === selected)?.label,
            }),
          })}
        </Button>
      </Flex>
    </Section>
  );
};

export default TopPicksSection;
