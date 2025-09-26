import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import type { HomePageContentDto } from './types/homepage';

export const useHomePageContent = () =>
  useQuery<HomePageContentDto>({
    queryKey: ['homepageContent'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<HomePageContentDto>>('/api/homepage');
      return res.data.data;
    },
    staleTime: 60_000,
  });
