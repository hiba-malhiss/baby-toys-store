import { useParams } from 'react-router-dom';
import { useBreadcrumb } from '@baby-toys/ui-kit/hooks';
import React, { useEffect } from 'react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { BouncingDotsLoader } from '@baby-toys/ui-kit';
import { ProductOverview } from './ProductOverview/ProductOverview.tsx';
import { ProductInfoTabs } from './ProductInfoTabs.tsx';
import RelatedProducts from './RelatedProducts.tsx';
import { useProductById } from '../../api/productApi';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setExtraCrumbs } = useBreadcrumb();
  const numericId = id ? Number(id) : undefined;
  const { data: product, isLoading } = useProductById(numericId);

  useEffect(() => {
    if (!product) return;
    setExtraCrumbs([{ label: product?.name ?? '', path: `/product-details/${product?.id}` }]);

    return () => setExtraCrumbs(null);
  }, [product, setExtraCrumbs]);

  if (isLoading || !product) {
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
