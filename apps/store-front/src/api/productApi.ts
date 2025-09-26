import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { Product } from './types/product';

export const useTopPicks = (sortBy: string, size = 10) => {
  return useQuery<Product[]>({
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
      return res.data.data.content;
    },
    staleTime: 60_000,
  });
};
