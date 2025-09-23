import React, { useCallback } from 'react';
import { getRelatedProducts } from '@mock-data/useMockApi';
import Section from '../../components/features/Section/Section.tsx';
import { ViewSwitcher } from '@baby-toys/ui-kit';
import styles from './product-details-page.module.scss';
import { useHandlePagination } from '../../hooks/useHandlePagination.ts';
import SmartProductCard from '../../components/features/SmartProductCard/SmartProductCard.tsx';

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
