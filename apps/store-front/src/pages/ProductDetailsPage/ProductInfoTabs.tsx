import { useState, useEffect } from 'react';
import { TabBar } from '@baby-toys/ui-kit/components';
import { TabBarItem } from '@baby-toys/ui-kit/components';
import styles from './product-details-page.module.scss';
import { Card } from '@baby-toys/ui-kit/components';
import { getPolicies, useMockProductsApi } from '../../mock-data/useMockProductsApi.ts';
import { ExpandableContent } from '@baby-toys/ui-kit/components';
import { ProductReviews } from './ProductReviews.tsx';

export const ProductInfoTabs = ({ productId }: { productId?: string }) => {
  const [description, setDescription] = useState('');
  const [descriptionLoading, setDescriptionLoading] = useState(true);
  const [policies, setPolicies] = useState<Record<
    string,
    { title: string; content: string }
  > | null>(null);
  const [policiesLoading, setPoliciesLoading] = useState(true);

  const { getProductDescription } = useMockProductsApi();

  useEffect(() => {
    if (!productId) return;

    getProductDescription(productId)
      .then(setDescription)
      .catch((error) => {
        console.error('Error fetching product description:', error);
      })
      .finally(() => {
        setDescriptionLoading(false);
      });
  }, [productId, getProductDescription]);

  // Load policies
  useEffect(() => {
    getPolicies()
      .then(setPolicies)
      .catch((error) => {
        console.error('Error fetching policies:', error);
      })
      .finally(() => {
        setPoliciesLoading(false);
      });
  }, []);

  return (
    <Card fullWidth size="large">
      <TabBar
        tabs={[
          { header: 'Description', value: 'description' },
          { header: 'Reviews', value: 'reviews' },
          { header: 'Cancellation Policy', value: 'order-cancellation' },
          { header: 'Return Policy', value: 'return-policy' },
        ]}
        defaultSelected="description"
      >
        <TabBarItem value="description">
          <ExpandableContent className={styles.productDetailsDescription}>
            {descriptionLoading ? 'Loading description...' : description}
          </ExpandableContent>
        </TabBarItem>

        <TabBarItem value="reviews">
          <ProductReviews productId={productId} />
        </TabBarItem>

        <TabBarItem value="order-cancellation">
          <ExpandableContent className={styles.productDetailsDescription}>
            {policiesLoading
              ? 'Loading cancellation policy...'
              : policies?.cancel?.content || 'No cancellation policy available.'}
          </ExpandableContent>
        </TabBarItem>

        <TabBarItem value="return-policy">
          <ExpandableContent className={styles.productDetailsDescription}>
            {policiesLoading
              ? 'Loading return policy...'
              : policies?.return?.content || 'No return policy available.'}
          </ExpandableContent>
        </TabBarItem>
      </TabBar>
    </Card>
  );
};
