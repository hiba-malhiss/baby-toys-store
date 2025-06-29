import { useShowMorePagination } from './useShowMorePagination.ts';
import { useMockProductsApi } from '../mock-data/useMockProductsApi.ts';
import type { Feedback } from '../types/product.types.ts';

export function useReviewsPagination(
  pageSize: number,
  mode: 'default' | 'show-more' = 'default',
  productId?: string
) {
  const { fetchProductReviews } = useMockProductsApi<Feedback>(pageSize, mode);

  return useShowMorePagination(
    (page) => productId ? fetchProductReviews(productId, page) : Promise.resolve({ items: [], page, totalPages: 0, totalItems: 0 }),
    pageSize
  );
}