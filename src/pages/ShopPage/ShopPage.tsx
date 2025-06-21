import { useState } from 'react';
import styles from './shop-page.module.scss';
import Card from '../../components/common/Card/Card.tsx';
import { categoriesRadioOptions } from '../../mock-data/shop-page.ts';
import CategoryFilter from './CategoryFilter.tsx';
import PriceFilter from './PriceFilter.tsx';
import ProductCard from '../../components/common/ProductCard/ProductCard.tsx';
import { toys } from '../../mock-data/toy-card-list.ts';
import Flex from '../../components/common/Flex/Flex.tsx';
import { type ViewMode, ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(categoriesRadioOptions[0].value);
  const [view, setView] = useState<ViewMode>();
  const selectedLabel =
    categoriesRadioOptions.find(({ value }) => value === selectedCategory)?.label ?? '';
  const navigate = useNavigate();

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
              <ProductCard
                key={toy.label}
                product={toy}
                direction="horizontal"
                size="small"
                onClick={(product) => navigate(`/product-details/${product.id}`)}
              />
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
      >
        {toys.map((toy) => (
          <ProductCard
            key={toy.label}
            product={toy}
            onClick={(product) => navigate(`/product-details/${product.id}`)}
            direction={view === 'grid' ? 'vertical' : 'horizontal'}
          />
        ))}
      </ViewSwitcher>
    </PageContainer>
  );
};

export default ShopPage;
