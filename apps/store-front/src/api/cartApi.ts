import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import { useAuth } from '../context/AuthContext';
import type { ApiEnvelope } from './types/common';
import { useToast } from '@baby-toys/ui-kit';

export type CartItemDTO = {
  id: number;
  productId: number;
  productName?: string;
  productImage?: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  availableStock?: number;
  outOfStock?: boolean;
};

export type CartDTO = {
  id: number;
  itemCount: number;
  subtotal: number;
  shipping: number;
  totalAmount: number;
  items: CartItemDTO[];
};

export const CART_KEYS = {
  cart: 'cart',
  cartCount: 'cartCount',
  addToCart: 'addToCart',
  updateCartItem: 'updateCartItem',
} as const;

export function useCartQuery() {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  return useQuery<CartDTO>({
    queryKey: [CART_KEYS.cart],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<CartDTO>>('/api/customer/cart');
      return res.data.data;
    },
    staleTime: 10_000,
    onError: (err: any) => {
      const msg = err?.message ?? 'Failed to load cart';
      toast.error(msg);
    },
  });
}

export function useCartCount() {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  return useQuery<number>({
    queryKey: [CART_KEYS.cartCount],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await api.get<{ data: { count: number } }>('/api/customer/cart/count');
      return res.data.data.count;
    },
    staleTime: 10_000,
    onError: (err: any) => {
      const msg = err?.message ?? 'Failed to load cart count';
      toast.error(msg);
    },
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<{ count: number }, any, { productId: number; quantity?: number }>({
    mutationKey: [CART_KEYS.addToCart],
    mutationFn: async ({ productId, quantity = 1 }) => {
      const res = await api.post<{ data: { count: number } }>('/api/customer/cart/items', {
        productId,
        quantity,
      });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CART_KEYS.cart] });
      qc.invalidateQueries({ queryKey: [CART_KEYS.cartCount] });
      qc.refetchQueries({ queryKey: [CART_KEYS.cart] });
      qc.refetchQueries({ queryKey: [CART_KEYS.cartCount] });
      toast.success('Added to cart');
    },
    onError: (err: any) => {
      const msg = err?.message ?? 'Failed to add to cart';
      toast.error(msg);
    },
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<{ count: number }, any, { itemId: number; quantity: number }>({
    mutationKey: [CART_KEYS.updateCartItem],
    mutationFn: async ({ itemId, quantity }) => {
      const res = await api.put<{ data: { count: number } }>(`/api/customer/cart/items/${itemId}`, {
        quantity,
      });
      return res.data.data;
    },
    onSuccess: () => {
      qc.refetchQueries({ queryKey: [CART_KEYS.cart] });
      qc.refetchQueries({ queryKey: [CART_KEYS.cartCount] });
      toast.success('Quantity updated');
    },
    onError: (err: any) => {
      const msg = err?.message ?? 'Failed to update quantity';
      toast.error(msg);
    },
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<{ id: number }, any, { itemId: number }>({
    mutationKey: ['removeFromCart'],
    mutationFn: async ({ itemId }) => {
      const res = await api.delete<{ data: { id: number } }>(`/api/customer/cart/items/${itemId}`);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CART_KEYS.cart] });
      qc.invalidateQueries({ queryKey: [CART_KEYS.cartCount] });
      toast.success('Removed from cart');
    },
    onError: (err: any) => {
      const msg = err?.message ?? 'Failed to remove from cart';
      toast.error(msg);
    },
  });
}
