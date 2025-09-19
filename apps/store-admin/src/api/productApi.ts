import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@baby-toys/ui-kit/components';
import api from './axiosConfig';
import { Product, CreateProductRequest, UpdateProductRequest } from './types/product';

export const useProducts = () =>
  useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/api/products')).data,
  });

export const useProduct = (id?: number) => {
  const navigate = useNavigate();
  const toast = useToast();

  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: async () => {
      try {
        return (await api.get(`/api/products/${id}`)).data;
      } catch (error: any) {
        toast.error('Product not found');
        navigate('/products');
        throw error;
      }
    },
    enabled: !!id,
    retry: false, // Don't retry on 404
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProductRequest) =>
      (await api.post('/api/admin/products', data)).data,
    onSuccess: () => queryClient.invalidateQueries(['products']),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateProductRequest) =>
      (await api.put(`/api/admin/products/${id}`, data)).data,
    onSuccess: () => queryClient.invalidateQueries(['products']),
  });
};

// Separate APIs for images
export const uploadMainImage = async (productId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return (
    await api.post(`/api/admin/products/${productId}/main-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data;
};

export const uploadProductImage = async (productId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return (
    await api.post(`/api/admin/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data;
};

export const useDeleteProductImage = (productId: number) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (imageUrl: string) => {
      const response = await api.delete(`/api/admin/products/${productId}/images`, {
        params: { imageUrl },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products', productId]);
      toast.success('Image deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete image');
    },
  });
};
