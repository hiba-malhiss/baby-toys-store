import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@baby-toys/ui-kit';
import api from './axiosConfig';
import { Product, CreateProductRequest, UpdateProductRequest } from './types/product';
import { ApiEnvelope, Page } from './types/common';

export interface UseProductsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
}

/** ---- Queries ---- */
export const useProducts = (params?: UseProductsParams) =>
  useQuery<Page<Product>>({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Page<Product>>>('/api/products', {
        params: {
          ...params,
          // Spring expects 0-based page and upper-case sort direction
          sortDirection: params?.sortDirection?.toString().toUpperCase(),
        },
      });
      return data.data;
    },
    keepPreviousData: true,
  });

export const useProduct = (id?: number) => {
  const navigate = useNavigate();
  const toast = useToast();

  return useQuery<Product>({
    queryKey: ['product', id],
    enabled: !!id,
    retry: false,
    queryFn: async () => {
      try {
        const { data } = await api.get<ApiEnvelope<Product>>(`/api/products/${id}`);
        return data.data;
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
        throw err;
      }
    },
  });
};

/** ---- Mutations ---- */
export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProductRequest) => {
      const { data } = await api.post<ApiEnvelope<{ id: number }>>('/api/admin/products', payload);
      return data.data.id;
    },
    onSuccess: () => qc.invalidateQueries(['products']),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateProductRequest & { id: number }) => {
      const { data } = await api.put<ApiEnvelope<{ id: number }>>(
        `/api/admin/products/${id}`,
        payload
      );
      return data.data.id;
    },
    onSuccess: () => {
      qc.invalidateQueries(['products']);
      toast.success('Product updated successfully');
      navigate('/products');
    },
    onError: () => {
      toast.error('Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiEnvelope<{ id: number }>>(`/api/admin/products/${id}`);
      return data.data.id;
    },
    onSuccess: () => {
      toast.success('Product deleted successfully');
      qc.invalidateQueries(['products']);
      navigate('/products');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to delete product'),
  });
};

/** ---- Image helpers ---- */
export const uploadMainImage = async (productId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<ApiEnvelope<{ id: number; imageUrl: string }>>(
    `/api/admin/products/${productId}/main-image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data.data;
};

export const uploadProductImage = async (productId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<ApiEnvelope<{ id: number; imageUrl: string }>>(
    `/api/admin/products/${productId}/images`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data.data;
};

export const useDeleteProducts = () => {
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const { data } = await api.delete<ApiEnvelope<{ count: number }>>(
        '/api/admin/products/batch',
        {
          data: ids,
        }
      );
      return data.data.count;
    },
    onSuccess: () => {
      toast.success('Products deleted successfully');
      qc.invalidateQueries(['products']);
      navigate('/products');
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || 'Failed to delete products');
    },
  });
};

export const useDeleteProductImage = (productId: number) => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (imageUrl: string) => {
      const { data } = await api.delete<ApiEnvelope<{ id: number }>>(
        `/api/admin/products/${productId}/images`,
        { params: { imageUrl } }
      );
      return data.data.id;
    },
    onSuccess: () => {
      qc.invalidateQueries(['product', productId]);
      toast.success('Image deleted successfully');
    },
    onError: () => toast.error('Failed to delete image'),
  });
};
