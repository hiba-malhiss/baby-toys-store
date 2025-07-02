import React from 'react';
import Section from '../../components/layout/Section/Section';
import SmartProductCard from '../../components/smart/SmartProductCard/SmartProductCard';
import Carousel from '../../components/common/Carousel/Carousel';
import styles from './shop-page.module.scss';
import type { Product } from '../../types/product.types';
import { useMockProductsApi } from '../../mock-data/useMockProductsApi';
import { SHOP_PAGE_SIZE } from '../../constants/display.constants';
import { ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher';
import { useHandlePagination } from '../../hooks/useHandlePagination.ts';

interface YouMayAlsoLikeSectionProps {
  mode?: 'carousel' | 'flex';
}

const YouMayAlsoLikeSection: React.FC<YouMayAlsoLikeSectionProps> = ({ mode = 'carousel' }) => {
  const { fetchProducts } = useMockProductsApi<Product>(SHOP_PAGE_SIZE);
  const { items, totalSize, page, loading, handlePaginationChange } = useHandlePagination(
    (page, filters) => fetchProducts(page, filters),
    SHOP_PAGE_SIZE,
    false,
    'show-more'
  );

  return (
    <Section
      title="You May Also Like"
      className={styles.shopPageRelatedProducts}
      isLoading={loading && page === 1}
    >
      {mode === 'carousel' ? (
        <Carousel
          className="bts-marginTxxxxl"
          items={items}
          circular
          numVisible={4}
          orientation="horizontal"
          showNavigation
          responsiveOptions={[
            { breakpoint: '900', numVisible: 3 },
            { breakpoint: '600', numVisible: 2 },
            { breakpoint: '400', numVisible: 1 },
          ]}
          itemTemplate={(product) => (
            <SmartProductCard fullWidth product={product} direction="vertical" />
          )}
        />
      ) : (
        <ViewSwitcher
          items={items.map((product) => (
            <SmartProductCard key={product.id} product={product} direction="vertical" />
          ))}
          className="bts-marginTxxxxl"
          page={page}
          pageSize={SHOP_PAGE_SIZE}
          totalSize={totalSize}
          onPaginationChange={handlePaginationChange}
          staticView="flex"
          paginationMode="show-more"
          isLoading={loading}
        />
      )}
    </Section>
  );
};

export default YouMayAlsoLikeSection;
