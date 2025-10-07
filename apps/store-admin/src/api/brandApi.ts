import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from './axiosConfig';
import { Brand, BrandUpsertRequest, BrandDetailsAdminDto } from './types/brand';
import { ApiEnvelope } from './types/common';

export const useBrands = () => {
  return useQuery<Brand[], AxiosError>({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<Brand[]>>('/api/brands');
      return response.data.data;
    },
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<number, AxiosError, BrandUpsertRequest>({
    mutationFn: async (payload) => {
      const response = await api.post<ApiEnvelope<{ id: number }>>('/api/admin/brands', payload);
      return response.data.data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<number, AxiosError, { id: number } & BrandUpsertRequest>({
    mutationFn: async ({ id, ...payload }) => {
      const response = await api.put<ApiEnvelope<{ id: number }>>(`/api/admin/brands/${id}`, payload);
      return response.data.data.id;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brand-admin', variables.id] });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<number, AxiosError, number>({
    mutationFn: async (id) => {
      const res = await api.delete<ApiEnvelope<{ id: number }>>(`/api/admin/brands/${id}`);
      return res.data.data.id;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.removeQueries({ queryKey: ['brands', id] });
    },
  });
};

export const useUploadBrandImage = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: number; imageUrl: string }, AxiosError, { id: number; file: File }>({
    mutationFn: async ({ id, file }) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<ApiEnvelope<{ id: number; imageUrl: string }>>(
        `/api/admin/brands/${id}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brand-admin', data.id] });
    },
  });
};

export const useBrandAdmin = (id?: number) => {
  return useQuery<BrandDetailsAdminDto, AxiosError>({
    queryKey: ['brand-admin', id],
    enabled: !!id,
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<BrandDetailsAdminDto>>(`/api/admin/brands/${id}`);
      return response.data.data;
    },
  });
};
