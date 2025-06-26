import { useState } from 'react';
import styles from './shop-page.module.scss';
import Card from '../../components/common/Card/Card.tsx';
import { categoriesRadioOptions } from '../../mock-data/shop-page.ts';
import CategoryFilter from './CategoryFilter.tsx';
import PriceFilter from './PriceFilter.tsx';
import { toys } from '../../mock-data/toy-card-list.ts';
import Flex from '../../components/common/Flex/Flex.tsx';
import { type ViewMode, ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import SmartProductCard from '../../components/smart/SmartProductCard/SmartProductCard.tsx';
import { SortProducts } from './SortProducts.tsx';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(categoriesRadioOptions[0].value);
  const [view, setView] = useState<ViewMode>();
  const selectedLabel =
    categoriesRadioOptions.find(({ value }) => value === selectedCategory)?.label ?? '';

  return (
    <PageContainer className={styles.shopPage}>
      <div className={styles.shopPageRightSide}>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        ></CategoryFilter>
        <PriceFilter onApply={() => {}}></PriceFilter>
        <Card header="Popular products">
          <Flex direction="vertical" spacing="s">
            {toys.slice(1, 4).map((toy) => (
              <SmartProductCard key={toy.label} product={toy} direction="horizontal" size="small" />
            ))}
          </Flex>
        </Card>
      </div>
      <ViewSwitcher
        className={styles.shopPageCollection}
        header={selectedLabel}
        pageSize={8}
        minColWidth={250}
        totalSize={toys.length}
        onViewChange={(newView) => setView(newView)}
        topBar={
          <Flex>
            <SortProducts />
          </Flex>
        }
      >
        {toys.map((toy) => (
          <SmartProductCard
            key={toy.label}
            product={toy}
            direction={view === 'grid' ? 'vertical' : 'horizontal'}
          />
        ))}
      </ViewSwitcher>
    </PageContainer>
  );
};

export default ShopPage;
