import React, { useEffect, useState } from 'react';
import Section from '../../components/layout/Section/Section';
import Carousel from '../../components/common/Carousel/Carousel';
import SmartProductCard from '../../components/smart/SmartProductCard/SmartProductCard';
import styles from './shop-page.module.scss';
import type { Product } from '../../types/product.types';
import { useMockProductsApi } from '../../mock-data/useMockProductsApi';
import { DEFAULT_SORT_OPTION } from '../../constants/filters.constants';
import { SHOP_PAGE_SIZE } from '../../constants/display.constants';
import BouncingDotsLoader from '../../components/common/BouncingDotsLoader/BouncingDotsLoader.tsx';

const YouMayAlsoLikeSection: React.FC = () => {
  const { fetchProducts } = useMockProductsApi<Product>(SHOP_PAGE_SIZE);
  const [relatedItems, setRelatedItems] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    setRelatedLoading(true);
    fetchProducts(1, { sortBy: DEFAULT_SORT_OPTION })
      .then((data) => {
        setRelatedItems(data.items);
      })
      .catch((error) => {
        console.error('Error fetching related products:', error);
      })
      .finally(() => setRelatedLoading(false));
  }, []); // Only run once on mount

  return (
    <Section
      title="You May Also Like"
      className={styles.shopPageRelatedProducts}
      isLoading={relatedLoading}
    >
      <Carousel
        className="bts-marginTxxxxl"
        items={relatedItems}
        circular
        numVisible={4}
        orientation="horizontal"
        showNavigation
        responsiveOptions={[
          { breakpoint: '900', numVisible: 3 },
          { breakpoint: '600', numVisible: 2 },
          { breakpoint: '400', numVisible: 1 },
        ]}
        itemTemplate={(toy) => <SmartProductCard fullWidth product={toy} direction="vertical" />}
      />
    </Section>
  );
};

export default YouMayAlsoLikeSection;
