import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { Product } from './types/product';
import { normalizeProduct, type UiProduct } from './normalizers/productNormalizer';
import { useAuth } from '../context/AuthContext';

export function useMyWishlist(
  page: number,
  size: number,
  sortBy = 'id',
  sortDirection: 'ASC' | 'DESC' = 'DESC'
) {
  const { isAuthenticated } = useAuth();
  const zeroBased = Math.max(0, (page || 1) - 1);
  return useQuery<{ items: UiProduct[]; page: number; totalPages: number; totalItems: number }>({
    queryKey: ['myWishlist', isAuthenticated, zeroBased, size, sortBy, sortDirection],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Page<Product>>>('/api/customer/wishlist', {
        params: { page: zeroBased, size, sortBy, sortDirection },
      });
      const data = res.data.data;
      return {
        items: (data?.content || []).map((dto) => normalizeProduct(dto)),
        page: (data?.number ?? zeroBased) + 1,
        totalPages: data?.totalPages ?? 0,
        totalItems: data?.totalElements ?? 0,
      };
    },
    staleTime: 15_000,
    enabled: isAuthenticated,
  });
}

export function useWishlistCount() {
  const { isAuthenticated } = useAuth();
  return useQuery<number>({
    queryKey: ['wishlistCount'],
    queryFn: async () => {
      const res = await api.get<{ data: number }>('/api/customer/wishlist/count');
      return res.data.data;
    },
    staleTime: 30_000,
    enabled: isAuthenticated,
  });
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  return useMutation<{ count?: number }, any, { productId: number }>({
    mutationKey: ['addToWishlist'],
    mutationFn: async ({ productId }) => {
      const res = await api.post<{ data: { count?: number } }>(
        `/api/customer/wishlist/${productId}`
      );
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate products so inWishlist flags refresh
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['productById', variables.productId] });
      qc.invalidateQueries({ queryKey: ['relatedProducts'] });
      qc.invalidateQueries({ queryKey: ['myWishlist'] });
      qc.invalidateQueries({ queryKey: ['highlights'] });
      qc.invalidateQueries({ queryKey: ['wishlistCount'] });
    },
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  return useMutation<{ id?: number }, any, { productId: number }>({
    mutationKey: ['removeFromWishlist'],
    mutationFn: async ({ productId }) => {
      const res = await api.delete<{ data: { id?: number } }>(
        `/api/customer/wishlist/${productId}`
      );
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['productById', variables.productId] });
      qc.invalidateQueries({ queryKey: ['relatedProducts'] });
      qc.invalidateQueries({ queryKey: ['myWishlist'] });
      qc.invalidateQueries({ queryKey: ['highlights'] });
      qc.invalidateQueries({ queryKey: ['wishlistCount'] });
    },
  });
}
