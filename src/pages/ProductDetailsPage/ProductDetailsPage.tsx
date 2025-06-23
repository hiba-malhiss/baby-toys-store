import { useNavigate, useParams } from 'react-router-dom';
import { useBreadcrumb } from '../../context/BreadcrumbContext.tsx';
import { useEffect } from 'react';
import { getProductById, toys } from '../../mock-data/toy-card-list.ts';
import Section from '../../components/layout/Section/Section.tsx';
import ProductCard from '../../components/common/ProductCard/ProductCard.tsx';
import Carousel from '../../components/common/Carousel/Carousel.tsx';
import styles from './product-details-page.module.scss';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { ProductInfoTabs } from './ProductInfoTabs.tsx';
import { ProductOverview } from './ProductOverview/ProductOverview.tsx';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setExtraCrumbs } = useBreadcrumb();
  const product = getProductById(id);
  const navigate = useNavigate();
  const productName = product?.name;
  const productId = product?.id;

  useEffect(() => {
    setExtraCrumbs([{ label: productName, path: `/product-details/${productId}` }]);
    return () => setExtraCrumbs(null);
  }, [productName, productId, setExtraCrumbs]);

  return (
    <PageContainer>
      <ProductOverview product={product} />
      <ProductInfoTabs />
      <Section title="Related products">
        <Carousel
          className={styles.productDetailsRelatedProd}
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
            <ProductCard
              fullWidth
              key={toy.label}
              product={toy}
              onClick={(product) => navigate(`/product-details/${product.id}`)}
              direction="vertical"
            />
          )}
        />
      </Section>
    </PageContainer>
  );
};

export default ProductDetailsPage;
