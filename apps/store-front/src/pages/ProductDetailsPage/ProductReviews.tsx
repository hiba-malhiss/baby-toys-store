import React from 'react';
import { ReviewCard } from '@baby-toys/ui-kit';
import { ViewSwitcher } from '@baby-toys/ui-kit';
import { mockFetchProductReviews } from '@mock-data/useMockApi';
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
      items={reviews.map((review, index) => (
        <ReviewCard key={`review-${index}`} review={review} appearance="detailed" />
      ))}
    />
  );
};
