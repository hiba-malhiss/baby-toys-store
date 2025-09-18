import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from './axiosConfig';
import { Category } from './types/category';

export const useCategories = () => {
  return useQuery<Category[], AxiosError>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<Category[]>('/api/categories');
      return response.data;
    },
  });
};

export const useCategory = (id: number) => {
  return useQuery<Category, AxiosError>({
    queryKey: ['categories', id],
    queryFn: async () => {
      const response = await api.get<Category>(`/api/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, AxiosError, Omit<Category, 'id'>>({
    mutationFn: async (category) => {
      const response = await api.post<Category>('/api/admin/categories', category);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, AxiosError, Category>({
    mutationFn: async (category) => {
      const { id, ...updateData } = category;
      const response = await api.put<Category>(`/api/admin/categories/${id}`, updateData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', data.id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: async (id) => {
      await api.delete(`/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUploadCategoryImage = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, AxiosError, { id: number; file: File }>({
    mutationFn: async ({ id, file }) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/api/admin/categories/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', data.id] });
    },
  });
};
