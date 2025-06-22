import React, { useState } from 'react';
import Card from '../../components/common/Card/Card.tsx';
import Slider from '../../components/common/Slider/Slider.tsx';
import styles from './shop-page.module.scss';
import { Button } from '../../components/common/Button/Button.tsx';

interface CategoryFilterProps {
  onApply: (value: [number, number]) => void;
}

const PriceFilter: React.FC<CategoryFilterProps> = ({ onApply }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 100]);

  return (
    <Card header="Filter by price" className={styles.shopPagePriceFilter}>
      <Slider
        min={50}
        max={100}
        step={1}
        range
        value={priceRange}
        onChange={(val: [number, number]) => setPriceRange(val)}
      />
      <Button
        appearance="filled"
        size="large"
        isRounded={false}
        className={styles.shopPagePriceFilterBtn}
        onClick={() => onApply(priceRange)}
      >
        Apply
      </Button>
    </Card>
  );
};

export default PriceFilter;
