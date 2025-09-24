import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from './axiosConfig';
import { Category } from './types/category';
import { ApiEnvelope } from './types/common';

export const useCategories = () => {
  return useQuery<Category[], AxiosError>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<Category[]>>('/api/categories');
      return response.data.data;
    },
  });
};

export const useCategory = (id: number) => {
  return useQuery<Category, AxiosError>({
    queryKey: ['categories', id],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<Category>>(`/api/categories/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<number, AxiosError, Omit<Category, 'id'>>({
    mutationFn: async (category) => {
      const response = await api.post<ApiEnvelope<{ id: number }>>('/api/admin/categories', category);
      return response.data.data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<number, AxiosError, Category>({
    mutationFn: async (category) => {
      const { id, ...updateData } = category;
      const response = await api.put<ApiEnvelope<{ id: number }>>(`/api/admin/categories/${id}`, updateData);
      return response.data.data.id;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<number, AxiosError, number>({
    mutationFn: async (id) => {
      const res = await api.delete<ApiEnvelope<{ id: number }>>(`/api/admin/categories/${id}`);
      return res.data.data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUploadCategoryImage = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: number; imageUrl: string }, AxiosError, { id: number; file: File }>({
    mutationFn: async ({ id, file }) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<ApiEnvelope<{ id: number; imageUrl: string }>>(
        `/api/admin/categories/${id}/image`,
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
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', data.id] });
    },
  });
};
