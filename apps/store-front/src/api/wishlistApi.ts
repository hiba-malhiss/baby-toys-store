import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { Product } from './types/product';
import { normalizeProduct, type UiProduct } from './normalizers/productNormalizer';
import { useAuth } from '../context/AuthContext';
import { useWishlistIdsStore } from '../store/useWishlistIdsStore';

export function useMyWishlist(
  page: number,
  size: number,
  sortBy = 'id',
  sortDirection: 'ASC' | 'DESC' = 'DESC',
  categoryId?: number | null,
  stock: 'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_SALE' = 'ALL'
) {
  const { isAuthenticated } = useAuth();
  const zeroBased = Math.max(0, (page || 1) - 1);
  return useQuery<{ items: UiProduct[]; page: number; totalPages: number; totalItems: number }>({
    queryKey: ['myWishlist', isAuthenticated, zeroBased, size, sortBy, sortDirection, categoryId ?? null, stock],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Page<Product>>>('/api/customer/wishlist', {
        params: {
          page: zeroBased,
          size,
          sortBy,
          sortDirection,
          categoryId: categoryId ?? undefined,
          stock,
        },
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

export function useWishlistIds() {
  const { isAuthenticated } = useAuth();
  const setAll = useWishlistIdsStore((s) => s.setAll);
  return useQuery<number[]>({
    queryKey: ['wishlistIds'],
    queryFn: async () => {
      const res = await api.get<{ data: number[] }>('/api/customer/wishlist/ids');
      const ids = res.data.data || [];
      setAll(ids);
      return ids;
    },
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  const add = useWishlistIdsStore((s) => s.add);
  return useMutation<{ count?: number }, any, { productId: number }>({
    mutationKey: ['addToWishlist'],
    mutationFn: async ({ productId }) => {
      const res = await api.post<{ data: { count?: number } }>(
        `/api/customer/wishlist/${productId}`
      );
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      add(variables.productId);
      qc.invalidateQueries({ queryKey: ['wishlistCount'] });
      qc.invalidateQueries({ queryKey: ['myWishlist'] });
    },
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  const remove = useWishlistIdsStore((s) => s.remove);
  return useMutation<{ id?: number }, any, { productId: number }>({
    mutationKey: ['removeFromWishlist'],
    mutationFn: async ({ productId }) => {
      const res = await api.delete<{ data: { id?: number } }>(
        `/api/customer/wishlist/${productId}`
      );
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      remove(variables.productId);
      qc.invalidateQueries({ queryKey: ['wishlistCount'] });
      qc.invalidateQueries({ queryKey: ['myWishlist'] });
    },
  });
}
