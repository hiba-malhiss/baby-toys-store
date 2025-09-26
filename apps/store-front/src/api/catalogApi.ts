import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import type { Brand, Category, Color, Material } from './types/catalog.ts';
import { AxiosError } from 'axios';

export const useCategories = () =>
  useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Category[]>>('/api/categories');
      return res.data.data;
    },
  });

export const useMaterials = () => {
  return useQuery<Material[]>({
    queryKey: ['materials'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<Material[]>>('/api/materials');
      return response.data.data;
    },
  });
};

export const useBrands = () => {
  return useQuery<Brand[], AxiosError>({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<Brand[]>>('/api/brands');
      return response.data.data;
    },
  });
};

export const useColors = () =>
  useQuery<Color[]>({
    queryKey: ['colors'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Color[]>>('/api/colors');
      return res.data.data;
    },
  });
