import { useParams } from 'react-router-dom';
import { useBreadcrumb } from '../../context/BreadcrumbContext.tsx';
import React, { useEffect, useState } from 'react';
import Section from '../../components/layout/Section/Section.tsx';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { ProductInfoTabs } from './ProductInfoTabs.tsx';
import { ProductOverview } from './ProductOverview/ProductOverview.tsx';
import SmartProductCard from '../../components/smart/SmartProductCard/SmartProductCard.tsx';
import { ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import { useMockProductsApi } from '../../mock-data/useMockProductsApi.ts';
import { useHandlePagination } from '../../hooks/useHandlePagination.ts';
import type { Product } from '../../types/product.types.ts';
import styles from './product-details-page.module.scss';

const RELATED_PRODUCTS_PAGE_SIZE = 4;

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setExtraCrumbs } = useBreadcrumb();
  const [product, setProduct] = useState<Product | undefined>();

  const { getProductById, getRelatedProducts } = useMockProductsApi<Product>(
    RELATED_PRODUCTS_PAGE_SIZE
  );

  // Use a custom fetch function for related products
  const fetchRelatedProducts = async (page: number) => {
    if (!id) {
      return { items: [], page, totalPages: 0, totalItems: 0 };
    }

    const relatedProducts = await getRelatedProducts(id, RELATED_PRODUCTS_PAGE_SIZE);
    return {
      items: relatedProducts,
      page,
      totalPages: Math.ceil(relatedProducts.length / RELATED_PRODUCTS_PAGE_SIZE),
      totalItems: relatedProducts.length,
    };
  };

  const {
    items: relatedItems,
    totalSize: relatedTotalSize,
    page: relatedPage,
    loading: relatedLoading,
    handlePaginationChange: handleRelatedPaginationChange,
  } = useHandlePagination(fetchRelatedProducts, RELATED_PRODUCTS_PAGE_SIZE, null, 'show-more');

  useEffect(() => {
    if (!id || product?.id === id) return;

    getProductById(id).then((data) => {
      setProduct(data);
      setExtraCrumbs([{ label: data?.name ?? '', path: `/product-details/${data?.id}` }]);
    });

    return () => setExtraCrumbs(null);
  }, [id, getProductById, setExtraCrumbs]);

  if (!product) {
    return null;
  }

  return (
    <PageContainer>
      <ProductOverview product={product} />
      <ProductInfoTabs productId={id} />
      <Section title="Related products">
        <ViewSwitcher
          className={styles.productDetailsRelatedProd}
          page={relatedPage}
          pageSize={RELATED_PRODUCTS_PAGE_SIZE}
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
    </PageContainer>
  );
};

export default ProductDetailsPage;
