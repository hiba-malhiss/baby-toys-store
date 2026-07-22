import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Button, RadioButtonGroup, SkeletonProductCard } from '@baby-toys/ui-kit';
import SmartProductCard from '../../../components/features/SmartProductCard/SmartProductCard.tsx';
import { useTopPicks } from '../../../api/productApi';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_SORT_OPTION,
  TOP_PICS_SORT_OPTIONS,
} from '../../../constants/filters.constants.ts';
import styles from './best-selling-grid.module.scss';

const GRID_LIMIT = 10;

const BestSellingGrid = () => {
  const [selected, setSelected] = useState(DEFAULT_SORT_OPTION);
  const navigate = useNavigate();
  const { data: items = [], isLoading } = useTopPicks(selected as any, GRID_LIMIT);
  const { t } = useTranslation('common');

  const handleSortChange = useCallback((val: string) => {
    setSelected(val);
  }, []);

  const handleViewAll = useCallback(() => {
    navigate(`/shop?sortBy=${encodeURIComponent(selected)}`);
  }, [navigate, selected]);

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('home.topPicks.title', { defaultValue: 'Best selling' })}</h2>
        <p className={styles.subtitle}>
          {t('home.topPicks.subtitle', {
            defaultValue: 'A top-notch not only fine collection, but also the map into electronic typesetting, remaining essentially unchanged.',
          })}
        </p>
      </div>

      <RadioButtonGroup
        className={styles.filters}
        options={TOP_PICS_SORT_OPTIONS.map((opt) => ({
          ...opt,
          label: t(`shop.sort.${opt.value}`, { defaultValue: opt.label }),
        }))}
        selectedValue={selected}
        name="bestSelling"
        onChange={handleSortChange}
        appearance="chip"
        justify="center"
      />

      <div className={styles.grid}>
        {isLoading &&
          Array.from({ length: GRID_LIMIT }).map((_, i) => (
            <React.Fragment key={`skeleton-${i}`}>
              <SkeletonProductCard fullWidth />
            </React.Fragment>
          ))}
        {!isLoading &&
          items.map((toy, index) => (
            <div
              key={toy.id || `product-${index}`}
              className={styles.gridItem}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <SmartProductCard product={toy} />
            </div>
          ))}
      </div>

      <Flex justify="center" className={styles.cta}>
        <Button appearance="outline" color="primary" size="large" onClick={handleViewAll}>
          {t('home.topPicks.viewAll', {
            label: t(`shop.sort.${selected}`, {
              defaultValue: TOP_PICS_SORT_OPTIONS.find((opt) => opt.value === selected)?.label,
            }),
          })}
        </Button>
      </Flex>
    </div>
  );
};

export default BestSellingGrid;
