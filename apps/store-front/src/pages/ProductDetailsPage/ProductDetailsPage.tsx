import { useParams } from 'react-router-dom';
import { useBreadcrumb } from '@baby-toys/ui-kit/hooks';
import React, { useEffect } from 'react';
import { PageContainer } from '../../components/Layout/PageContainer/PageContainer.tsx';
import { BouncingDotsLoader } from '@baby-toys/ui-kit';
import { ProductOverview } from './ProductOverview/ProductOverview.tsx';
import { ProductInfoTabs } from './ProductInfoTabs.tsx';
import RelatedProducts from './RelatedProducts.tsx';
import { useProductById } from '../../api/productApi';
import styles from './product-details-page.module.scss';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setExtraCrumbs } = useBreadcrumb();
  const numericId = id ? Number(id) : undefined;
  const { data: product, isLoading } = useProductById(numericId);

  useEffect(() => {
    if (!product) return;
    let name = product?.name || '';
    name = name?.length > 100 ? product?.name?.slice(0, 100) + '...' : name;
    setExtraCrumbs([{ label: name, path: `/product-details/${product?.id}` }]);

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
      <ProductInfoTabs product={product} />
      <div className={styles['productDetails-relatedProd']}>
        <RelatedProducts productId={id!} />
      </div>
    </PageContainer>
  );
};

export default ProductDetailsPage;
