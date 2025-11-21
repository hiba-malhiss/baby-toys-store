import api from './axiosConfig';
import { type AxiosResponse } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

export type ProductAnalyticsRow = {
  productId: number;
  year: number;
  month: number;
  viewsCount: number;
  wishlistCount: number;
  addedToCartCount: number;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page
  size: number;   // page size
};

export type ProductAnalyticsQuery = {
  productId?: number;
  from: string; // YYYY-MM
  to: string;   // YYYY-MM
  page?: number;
  size?: number;
  sortBy?: 'year' | 'month' | 'productId' | 'viewsCount' | 'wishlistCount' | 'addedToCartCount';
  sortDirection?: 'ASC' | 'DESC';
};

export async function fetchProductAnalytics(params: ProductAnalyticsQuery): Promise<PageResponse<ProductAnalyticsRow>> {
  const res: AxiosResponse<{ data: PageResponse<ProductAnalyticsRow> }> = await api.get('/api/admin/analytics/products', {
    params: {
      productId: params.productId,
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

export function useProductAnalytics() {
  const [params, setParams] = useState<ProductAnalyticsQuery | null>(null);
  const query = useQuery({
    queryKey: ['product-analytics', params],
    queryFn: async () => {
      if (!params) throw new Error('Params not set');
      return fetchProductAnalytics(params);
    },
    keepPreviousData: true,
    enabled: false,
  });

  const run = useCallback(async (next: ProductAnalyticsQuery) => {
    setParams(next);
    const res = await query.refetch();
    return res;
  }, [query]);

  return { ...query, run };
}
