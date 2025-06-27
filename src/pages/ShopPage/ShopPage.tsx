import { useState } from 'react';
import styles from './shop-page.module.scss';
import { categoriesRadioOptions } from '../../mock-data/shop-page.ts';
import { toys } from '../../mock-data/toy-card-list.ts';
import Flex from '../../components/common/Flex/Flex.tsx';
import { type ViewMode, ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import SmartProductCard from '../../components/smart/SmartProductCard/SmartProductCard.tsx';
import { SortProducts } from './SortProducts.tsx';
import Carousel from '../../components/common/Carousel/Carousel.tsx';
import Section from '../../components/layout/Section/Section.tsx';
import { type ShopFilters, SideFilters } from './SideFilters/SideFilters.tsx';

const ShopPage = () => {
  const [appliedFilters, setAppliedFilters] = useState<ShopFilters>();
  const [view, setView] = useState<ViewMode>();
  const selectedLabel =
    categoriesRadioOptions.find(({ value }) => value === appliedFilters?.category)?.label ?? '';

  return (
    <PageContainer className={styles.shopPage}>
      <SideFilters
        className={styles.shopPageRightSide}
        onFiltersChange={setAppliedFilters}
      ></SideFilters>
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
      <Section title="You May Also Like" className={styles.shopPageRelatedProducts}>
        <Carousel
          className="bts-marginTxxxxl"
          items={toys}
          circular
          numVisible={4}
          orientation="horizontal"
          showNavigation
          responsiveOptions={[
            { breakpoint: '900', numVisible: 3 },
            { breakpoint: '600', numVisible: 2 },
            { breakpoint: '400', numVisible: 1 },
          ]}
          itemTemplate={(toy) => (
            <SmartProductCard fullWidth key={toy.label} product={toy} direction="vertical" />
          )}
        />
      </Section>
    </PageContainer>
  );
};

export default ShopPage;
