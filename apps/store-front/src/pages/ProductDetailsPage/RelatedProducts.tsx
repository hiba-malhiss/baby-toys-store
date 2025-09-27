import React from 'react';
import Section from '../../components/features/Section/Section.tsx';
import { ViewSwitcher } from '@baby-toys/ui-kit';
import styles from './product-details-page.module.scss';
import SmartProductCard from '../../components/features/SmartProductCard/SmartProductCard.tsx';
import { useRelatedProductsInfinite } from '../../api/productApi';

const PAGE_SIZE = 6;
const RelatedProducts: React.FC<{ productId: string }> = React.memo(({ productId }) => {
  const numericId = productId ? Number(productId) : undefined;
  const infiniteQuery = useRelatedProductsInfinite(numericId, PAGE_SIZE);

  const items = infiniteQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const totalSize = infiniteQuery.data?.pages?.[0]?.totalItems ?? 0;
  const page = infiniteQuery.data?.pages.length ?? 1;
  const loading = infiniteQuery.isFetchingNextPage || infiniteQuery.isLoading;
  const hasMore = Boolean(infiniteQuery.hasNextPage);

  const handlePaginationChange = (newPage: number) => {
    if (newPage > page && infiniteQuery.hasNextPage) {
      infiniteQuery.fetchNextPage();
    }
  };

  return (
    <Section title="Related products">
      <ViewSwitcher
        className={styles.productDetailsRelatedProd}
        items={items.map((product) => (
          <SmartProductCard key={product.id} product={product} direction="vertical" />
        ))}
        page={page}
        pageSize={PAGE_SIZE}
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
