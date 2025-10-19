import { useInfiniteQuery } from '@tanstack/react-query';
import api from './axiosConfig';

export type ProductDto = {
  id: string | number;
  name?: string;
  title?: string;
  price?: number;
  images?: { url: string }[];
  image?: string;
  thumbnailUrl?: string;
  shortDescription?: string;
  availableInStock?: number;
  mainImage?: string;
};

type PageEnvelope<T> = {
  data: {
    content: T[];
    number: number; // zero-based page
    totalPages: number;
    totalElements: number;
  };
};

export function useProductsInfinite(sortBy: string, pageSize: number = 12) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', sortBy, pageSize],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const zero = Math.max(0, (pageParam as number) - 1);
      const res = await api.get<PageEnvelope<ProductDto>>('/api/products', {
        params: { page: zero, size: pageSize, sortBy, sortDirection: 'DESC' },
      });
      const data = res.data.data;
      return {
        items: data?.content || [],
        page: (data?.number ?? zero) + 1,
        totalPages: data?.totalPages ?? 0,
        totalItems: data?.totalElements ?? 0,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 30_000,
  });
}

// Filters shape similar to web
export type ProductsFilters = {
  query?: string;
  categoryId?: string | number;
  minPrice?: number;
  maxPrice?: number;
  brandIds?: Array<string | number>;
  colorIds?: Array<string | number>;
  materialIds?: Array<string | number>;
};

export function useProductsInfiniteWithFilters(
  sortBy: string,
  filters: ProductsFilters,
  pageSize: number = 12
) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', sortBy, pageSize, filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const zero = Math.max(0, (pageParam as number) - 1);
      const res = await api.get<PageEnvelope<ProductDto>>('/api/products', {
        params: {
          page: zero,
          size: pageSize,
          sortBy,
          sortDirection: 'DESC',
          query: filters.query || undefined,
          categoryId: filters.categoryId || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          brandIds: filters.brandIds?.join(',') || undefined,
          colorIds: filters.colorIds?.join(',') || undefined,
          materialIds: filters.materialIds?.join(',') || undefined,
        },
      });
      const data = res.data.data;
      return {
        items: data?.content || [],
        page: (data?.number ?? zero) + 1,
        totalPages: data?.totalPages ?? 0,
        totalItems: data?.totalElements ?? 0,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 30_000,
  });
}
