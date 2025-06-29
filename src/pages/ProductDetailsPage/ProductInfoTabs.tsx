import { useState, useEffect } from 'react';
import { TabBar } from '../../components/common/TabBar/TabBar.tsx';
import { TabBarItem } from '../../components/common/TabBar/TabBarItem.tsx';
import styles from './product-details-page.module.scss';
import Card from '../../components/common/Card/Card.tsx';
import FeedbackCard from '../../components/common/FeedbackCard/FeedbackCard.tsx';
import { ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import { useReviewsPagination } from '../../hooks/useReviewsPagination.ts';
import { useMockProductsApi } from '../../mock-data/useMockProductsApi.ts';
import ExpandableContent from '../../components/common/ExpandableContent/ExpandableContent.tsx';

const REVIEWS_PAGE_SIZE = 4;

export const ProductInfoTabs = ({ productId }: { productId?: string }) => {
  const [description, setDescription] = useState('');
  const [descriptionLoading, setDescriptionLoading] = useState(true);
  const { getProductDescription } = useMockProductsApi(REVIEWS_PAGE_SIZE);

  const {
    items: reviews,
    totalSize: reviewsTotalSize,
    page: reviewsPage,
    loading: reviewsLoading,
    handlePaginationChange: handleReviewsPaginationChange,
  } = useReviewsPagination(REVIEWS_PAGE_SIZE, 'default', productId);

  // Load product description
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
          <ViewSwitcher 
            gap="none" 
            page={reviewsPage}
            pageSize={REVIEWS_PAGE_SIZE} 
            totalSize={reviewsTotalSize}
            isLoading={reviewsLoading}
            staticView="list"
            onPaginationChange={handleReviewsPaginationChange}
            items={reviews.map((feedback, index) => (
              <FeedbackCard 
                key={`review-${index}`} 
                feedback={feedback} 
                appearance="detailed"
              />
            ))}
          />
        </TabBarItem>
        <TabBarItem value="order-cancellation">
          <ExpandableContent className={styles.productDetailsDescription}>
            {descriptionLoading ? 'Loading policy...' : description}
          </ExpandableContent>
        </TabBarItem>
        <TabBarItem value="return-policy">
          <ExpandableContent className={styles.productDetailsDescription}>
            {descriptionLoading ? 'Loading policy...' : description}
          </ExpandableContent>
        </TabBarItem>
      </TabBar>
    </Card>
  );
};