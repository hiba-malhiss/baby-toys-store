import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { Product } from './types/product';
import { normalizeProduct } from './normalizers/productNormalizer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export async function fetchHighlights(page: number, size: number) {
  const zeroBasedPage = Math.max(0, (page || 1) - 1);
  const res = await api.get<ApiEnvelope<Page<Product>>>('/api/products/highlights', {
    params: {
      page: zeroBasedPage,
      size,
    },
  });

  const data = res.data.data;
  const items = (data?.content || []).map((dto: Product) => normalizeProduct(dto));

  return {
    items,
    page: (data?.number ?? zeroBasedPage) + 1,
    totalPages: data?.totalPages ?? 0,
    totalItems: data?.totalElements ?? 0,
  };
}

export const highlightsQueryKey = (page: number, size: number) => {
  const zeroBasedPage = Math.max(0, (page || 1) - 1);
  return ['highlights', zeroBasedPage, size] as const;
};

export const highlightsQueryFn = (page: number, size: number) => () => fetchHighlights(page, size);

export function useHighlightsQuery(page: number, size: number) {
  return useQuery({
    queryKey: highlightsQueryKey(page, size),
    queryFn: highlightsQueryFn(page, size),
    keepPreviousData: true,
    staleTime: 30_000,
  });
}

export function useHighlightsInfiniteQuery(size: number) {
  return useInfiniteQuery({
    queryKey: ['highlights', size],
    queryFn: ({ pageParam = 1 }) => fetchHighlights(pageParam, size),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 30_000,
  });
}
