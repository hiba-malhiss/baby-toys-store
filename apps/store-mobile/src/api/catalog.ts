import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';

export type Category = {
  id: string;
  name: string;
  image?: string;
  isMain?: boolean;
};

// Match store-front envelope type minimal shape
type ApiEnvelope<T> = { data: T };

export const useCategories = () =>
  useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Category[]>>('/api/categories');
      return res.data.data;
    },
  });
