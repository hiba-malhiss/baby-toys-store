import React from 'react';
import FeedbackCard from '../../components/common/FeedbackCard/FeedbackCard.tsx';
import { ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import { mockFetchProductReviews } from '../../mock-data/useMockProductsApi.ts';
import { useHandlePagination } from '../../hooks/useHandlePagination.ts';

interface ProductReviewsProps {
  productId: string;
}

const PRODUCT_REVIEWS_PAGE_SIZE = 2;
export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const {
    items: reviews,
    totalSize,
    page,
    loading,
    handlePaginationChange,
  } = useHandlePagination(
    (page) =>
      productId
        ? mockFetchProductReviews(productId, page, PRODUCT_REVIEWS_PAGE_SIZE)
        : Promise.resolve({ items: [], page, totalPages: 0, totalItems: 0 }),
    PRODUCT_REVIEWS_PAGE_SIZE,
    false
  );

  return (
    <ViewSwitcher
      page={page}
      pageSize={PRODUCT_REVIEWS_PAGE_SIZE}
      totalSize={totalSize}
      isLoading={loading}
      staticView="list"
      onPaginationChange={handlePaginationChange}
      items={reviews.map((feedback, index) => (
        <FeedbackCard key={`review-${index}`} feedback={feedback} appearance="detailed" />
      ))}
    />
  );
};
