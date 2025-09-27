import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { Product } from './types/product';
import { normalizeProduct, type UiProduct } from './normalizers/productNormalizer';

export const useTopPicks = (sortBy: string, size = 10) => {
  return useQuery<UiProduct[]>({
    queryKey: ['topPicks', sortBy, size],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Page<Product>>>('/api/products', {
        params: {
          page: 0,
          size,
          sortBy,
          sortDirection: 'DESC',
        },
      });
      const data = res.data.data;
      return (data?.content || []).map((dto) => normalizeProduct(dto));
    },
    staleTime: 60_000,
  });
};

// Single product details by ID
export const useProductById = (id?: number | string) => {
  return useQuery<UiProduct | undefined>({
    queryKey: ['productById', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Product>>(`/api/products/${id}`);
      const dto = res.data.data;
      return dto ? normalizeProduct(dto) : undefined;
    },
    staleTime: 60_000,
  });
};

// Related products by product ID (infinite scrolling)
export const useRelatedProductsInfinite = (productId?: number | string, size: number = 6) => {
  return useInfiniteQuery({
    queryKey: ['relatedProducts', productId, size],
    enabled: Boolean(productId),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const zeroBased = Math.max(0, (pageParam as number) - 1);
      const res = await api.get<ApiEnvelope<Page<Product>>>(
        `/api/products/${productId}/related-products`,
        {
          params: { page: zeroBased, size },
        }
      );
      const data = res.data.data;
      return {
        items: (data?.content || []).map((dto) => normalizeProduct(dto)),
        page: (data?.number ?? zeroBased) + 1,
        totalPages: data?.totalPages ?? 0,
        totalItems: data?.totalElements ?? 0,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 30_000,
  });
};
