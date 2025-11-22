import api from './axiosConfig';
import { type AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

export type ProductAnalyticsRow = {
  productId: number;
  year: number;
  month: number;
  viewsCount: number;
  wishlistCount: number;
  addedToCartCount: number;
  trendingScore: number;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page
  size: number;   // page size
};

export type ProductAnalyticsQuery = {
  query?: string; // product id or SKU as string
  from: string; // YYYY-MM
  to: string;   // YYYY-MM
  page?: number;
  size?: number;
  sortBy?: 'year' | 'month' | 'viewsCount' | 'wishlistCount' | 'addedToCartCount' | 'productId';
  sortDirection?: 'ASC' | 'DESC';
};

export async function fetchProductAnalytics(params: ProductAnalyticsQuery): Promise<PageResponse<ProductAnalyticsRow>> {
  const res: AxiosResponse<{ data: PageResponse<ProductAnalyticsRow> }> = await api.get('/api/admin/analytics/products', {
    params: {
      query: params.query,
      from: params.from,
      to: params.to,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sortBy: params.sortBy ?? 'year',
      sortDirection: params.sortDirection ?? 'DESC',
    },
  });
  return res.data.data;
}

export function useProductAnalyticsMutation() {
  return useMutation({
    mutationFn: (params: ProductAnalyticsQuery) => fetchProductAnalytics(params),
  });
}
