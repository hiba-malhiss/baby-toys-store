import { useParams } from 'react-router-dom';
import { useBreadcrumb } from '@baby-toys/ui-kit/hooks';
import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { useMockProductsApi } from '@mock-data/useMockApi';
import type { Product } from '../../types/product.types.ts';
import { PRODUCT_RELATED_PRODUCTS_LIMIT } from '../../constants/display.constants.ts';
import { BouncingDotsLoader } from '@baby-toys/ui-kit/components';
import { ProductOverview } from './ProductOverview/ProductOverview.tsx';
import { ProductInfoTabs } from './ProductInfoTabs.tsx';
import RelatedProducts from './RelatedProducts.tsx';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setExtraCrumbs } = useBreadcrumb();
  const [product, setProduct] = useState<Product | undefined>();

  const { getProductById } = useMockProductsApi(PRODUCT_RELATED_PRODUCTS_LIMIT);

  useEffect(() => {
    if (!id || product?.id === id) return;

    getProductById(id).then((data) => {
      setProduct(data);
      setExtraCrumbs([{ label: data?.name ?? '', path: `/product-details/${data?.id}` }]);
    });

    return () => setExtraCrumbs(null);
  }, [id, getProductById, setExtraCrumbs]);

  if (!product) {
    return (
      <PageContainer>
        <BouncingDotsLoader size="large" className="bts-paddingVxxxxl" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ProductOverview product={product} />
      <ProductInfoTabs productId={id} />
      <RelatedProducts productId={id} />
    </PageContainer>
  );
};

export default ProductDetailsPage;
