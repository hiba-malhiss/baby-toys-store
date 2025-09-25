import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import type { Category } from './types/category';

export const useCategories = () =>
  useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Category[]>>('/api/categories');
      return res.data.data;
    },
  });
