import { useState } from 'react';
import styles from './shop-page.module.scss';
import Card from '../../components/common/Card/Card.tsx';
import Heading from '../../components/common/Heading/Heading.tsx';
import { categoriesRadioOptions } from '../../mock-data/shop-page.ts';
import CategoryFilter from './CategoryFilter.tsx';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(categoriesRadioOptions[0].value);
  const selectedLabel =
    categoriesRadioOptions.find(({ value }) => value === selectedCategory)?.label ?? '';

  return (
    <div className={styles.shopPage}>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onChange={setSelectedCategory}
      ></CategoryFilter>
      <Card header="Filters">children</Card>
      <Card header="Popular products">children</Card>
      <div className={styles.shopPageCollection}>
        <Heading level="h1">{selectedLabel}</Heading>
      </div>
    </div>
  );
};

export default ShopPage;
