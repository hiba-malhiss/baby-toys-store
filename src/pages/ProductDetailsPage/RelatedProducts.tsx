import React from 'react';
import SmartProductCard from '../../components/smart/SmartProductCard/SmartProductCard';
import { useMockProductsApi } from '../../mock-data/useMockProductsApi';
import type { Product } from '../../types/product.types';
import Section from '../../components/layout/Section/Section.tsx';
import { ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import styles from './product-details-page.module.scss';
import { PRODUCT_RELATED_PRODUCTS_LIMIT } from '../../constants/display.constants.ts';
import { useHandlePagination } from '../../hooks/useHandlePagination.ts';

const RelatedProducts: React.FC<{ productId: string }> = React.memo(({ productId }) => {
  const { getRelatedProducts } = useMockProductsApi<Product>(PRODUCT_RELATED_PRODUCTS_LIMIT);

  const fetchRelatedProducts = async (page: number) => {
    if (!productId) {
      return { items: [], page, totalPages: 0, totalItems: 0 };
    }

    const relatedProducts = await getRelatedProducts(productId, PRODUCT_RELATED_PRODUCTS_LIMIT);
    return {
      items: relatedProducts,
      page,
      totalPages: Math.ceil(relatedProducts.length / PRODUCT_RELATED_PRODUCTS_LIMIT),
      totalItems: relatedProducts.length,
    };
  };

  const {
    items: relatedItems,
    totalSize: relatedTotalSize,
    page: relatedPage,
    loading: relatedLoading,
    handlePaginationChange: handleRelatedPaginationChange,
  } = useHandlePagination(fetchRelatedProducts, PRODUCT_RELATED_PRODUCTS_LIMIT, null, 'show-more');

  return (
    <Section title="Related products">
      <ViewSwitcher
        className={styles.productDetailsRelatedProd}
        page={relatedPage}
        pageSize={PRODUCT_RELATED_PRODUCTS_LIMIT}
        totalSize={relatedTotalSize}
        isLoading={relatedLoading}
        staticView="flex"
        paginationMode="show-more"
        onPaginationChange={handleRelatedPaginationChange}
        minColWidth={220}
        items={relatedItems.map((item, index) => (
          <SmartProductCard key={item.id || `related-${item.label}-${index}`} product={item} />
        ))}
      />
    </Section>
  );
});

export default RelatedProducts;
