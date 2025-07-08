import React, { useCallback } from 'react';
import SmartProductCard from '../../components/shared/SmartProductCard/SmartProductCard';
import { getRelatedProducts } from '../../mock-data/useMockProductsApi';
import Section from '../../components/shared/Section/Section.tsx';
import { ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import styles from './product-details-page.module.scss';
import { useHandlePagination } from '../../hooks/useHandlePagination.ts';

const PAGE_NUMBER = 6;
const RelatedProducts: React.FC<{ productId: string }> = React.memo(({ productId }) => {
  const fetchRelatedProducts = useCallback(
    (page) => getRelatedProducts(productId, page, PAGE_NUMBER),
    [productId]
  );

  const { items, totalSize, page, loading, handlePaginationChange, hasMore } = useHandlePagination(
    fetchRelatedProducts,
    PAGE_NUMBER,
    false,
    'infinite-scroll'
  );

  return (
    <Section title="Related products">
      <ViewSwitcher
        className={styles.productDetailsRelatedProd}
        items={items.map((product) => (
          <SmartProductCard key={product.id} product={product} direction="vertical" />
        ))}
        page={page}
        pageSize={PAGE_NUMBER}
        totalSize={totalSize}
        onPaginationChange={handlePaginationChange}
        staticView="flex"
        paginationMode="infinite-scroll"
        isLoading={loading}
        hasMore={hasMore}
      />
    </Section>
  );
});

export default RelatedProducts;
