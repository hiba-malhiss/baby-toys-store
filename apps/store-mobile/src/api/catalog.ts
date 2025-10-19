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

// Additional catalog lookups to match store-front filters
export type Brand = { id: string | number; name: string };
export type Color = { id: string | number; name: string; code?: string };
export type Material = { id: string | number; name: string };

export const useBrands = () =>
  useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Brand[]>>('/api/brands');
      return res.data.data;
    },
  });

export const useColors = () =>
  useQuery<Color[]>({
    queryKey: ['colors'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Color[]>>('/api/colors');
      return res.data.data;
    },
  });

export const useMaterials = () =>
  useQuery<Material[]>({
    queryKey: ['materials'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Material[]>>('/api/materials');
      return res.data.data;
    },
  });
