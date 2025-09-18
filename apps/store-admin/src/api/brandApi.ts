import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from './axiosConfig';
import { Brand } from './types/brand';

export const useBrands = () => {
  return useQuery<Brand[], AxiosError>({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await api.get<Brand[]>('/api/brands');
      return response.data;
    },
  });
};

export const useBrand = (id: number) => {
  return useQuery<Brand, AxiosError>({
    queryKey: ['brands', id],
    queryFn: async () => {
      const response = await api.get<Brand>(`/api/brands/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<Brand, AxiosError, Omit<Brand, 'id'>>({
    mutationFn: async (brand) => {
      const response = await api.post<Brand>('/api/admin/brands', brand);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<Brand, AxiosError, Brand>({
    mutationFn: async (brand) => {
      const { id, ...updateData } = brand;
      const response = await api.put<Brand>(`/api/admin/brands/${id}`, updateData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brands', data.id] });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: async (id) => {
      await api.delete(`/api/admin/brands/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.removeQueries({ queryKey: ['brands', id] });
    },
  });
};

export const useUploadBrandImage = () => {
  const queryClient = useQueryClient();

  return useMutation<Brand, AxiosError, { id: number; file: File }>({
    mutationFn: async ({ id, file }) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/api/admin/brands/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brands', data.id] });
    },
  });
};
