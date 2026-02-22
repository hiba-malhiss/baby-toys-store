import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import type { Category, AttributeTypePublicDto, OptionTypePublicDto } from './types/catalog.ts';

export const useCategories = () =>
  useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Category[]>>('/api/categories');
      return res.data.data;
    },
  });

export const useFilterableAttributes = () =>
  useQuery<AttributeTypePublicDto[]>({
    queryKey: ['filterableAttributes'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<AttributeTypePublicDto[]>>(
        '/api/public/attributes/filterable'
      );
      return res.data.data;
    },
    staleTime: 60_000,
  });

export const useFilterableOptions = () =>
  useQuery<OptionTypePublicDto[]>({
    queryKey: ['filterableOptions'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<OptionTypePublicDto[]>>(
        '/api/public/options/filterable'
      );
      return res.data.data;
    },
    staleTime: 60_000,
  });
