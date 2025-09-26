import { useQuery } from '@tanstack/react-query';
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
