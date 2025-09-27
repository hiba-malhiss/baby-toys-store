import React from 'react';
import { ReviewCard } from '@baby-toys/ui-kit';
import { ViewSwitcher } from '@baby-toys/ui-kit';
import { useProductReviews } from '../../api/reviewsApi.ts';
import { faComments } from '@fortawesome/free-solid-svg-icons';

interface ProductReviewsProps {
  productId: string;
}

const PRODUCT_REVIEWS_PAGE_SIZE = 5;

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useProductReviews(productId, page, PRODUCT_REVIEWS_PAGE_SIZE);

  const reviews = data?.items ?? [];
  const totalSize = data?.totalElements ?? 0;
  const handlePaginationChange = (newPage: number) => setPage(newPage);

  return (
    <ViewSwitcher
      page={page}
      pageSize={PRODUCT_REVIEWS_PAGE_SIZE}
      totalSize={totalSize}
      isLoading={isLoading}
      emptyIcon={faComments}
      emptyMessage="No reviews yet"
      emptySubtext="Be the first to review this product."
      emptyAlign="center"
      staticView="list"
      onPaginationChange={handlePaginationChange}
      items={reviews.map((review, index) => (
        <ReviewCard key={`review-${index}`} review={review} appearance="detailed" fullWidth />
      ))}
    />
  );
};
