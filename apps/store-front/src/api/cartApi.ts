import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import { useAuth } from '../context/AuthContext';
import type { ApiEnvelope } from './types/common';
import { useToast } from '@baby-toys/ui-kit';
import { hasGuestCartToken } from '../utils/guestCart.ts';

export type CartItemDTO = {
  id: number;
  productId: number;
  productName?: string;
  productImage?: string;
  unitPrice: number;
  originalPrice?: number | null;
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
  freeShippingRemaining: number;
  freeShippingApplied: boolean;
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
    queryFn: async () => {
      const endpoint = isAuthenticated ? '/api/customer/cart' : '/api/guest/cart';
      const res = await api.get<ApiEnvelope<CartDTO>>(endpoint);
      return res.data.data;
    },
    enabled: isAuthenticated || hasGuestCartToken(),
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
    queryFn: async () => {
      if (isAuthenticated) {
        const res = await api.get<{ data: { count: number } }>('/api/customer/cart/count');
        return res.data.data.count;
      } else if (hasGuestCartToken()) {
        // Guest: backend has no /count endpoint, so fetch full cart
        const res = await api.get<ApiEnvelope<CartDTO>>('/api/guest/cart');
        return res.data.data.itemCount;
      }
    },
    enabled: isAuthenticated || hasGuestCartToken(),
    staleTime: 10_000,
    onError: (err: any) => {
      const msg = err?.message ?? 'Failed to load cart count';
      toast.error(msg);
    },
  });
}

export function useAddToCart() {
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<
    { count: number },
    any,
    { productId: number; variantId: number; quantity?: number }
  >({
    mutationKey: [CART_KEYS.addToCart],
    mutationFn: async ({ productId, variantId, quantity = 1 }) => {
      const endpoint = isAuthenticated ? '/api/customer/cart/items' : '/api/guest/cart/items';
      const res = await api.post<{ data: { count: number } }>(endpoint, {
        productId,
        variantId,
        quantity,
      });
      return res.data.data;
    },
    enabled: isAuthenticated || hasGuestCartToken(),
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
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<{ count: number }, any, { itemId: number; quantity: number }>({
    mutationKey: [CART_KEYS.updateCartItem],
    mutationFn: async ({ itemId, quantity }) => {
      const endpoint = isAuthenticated
        ? `/api/customer/cart/items/${itemId}`
        : `/api/guest/cart/items/${itemId}`;
      const res = await api.put<{ data: { count: number } }>(endpoint, {
        quantity,
      });
      return res.data.data;
    },
    enabled: isAuthenticated || hasGuestCartToken(),
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
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<{ id: number }, any, { itemId: number }>({
    mutationKey: ['removeFromCart'],
    mutationFn: async ({ itemId }) => {
      const endpoint = isAuthenticated
        ? `/api/customer/cart/items/${itemId}`
        : `/api/guest/cart/items/${itemId}`;
      const res = await api.delete<{ data: { id: number } }>(endpoint);
      return res.data.data;
    },
    enabled: isAuthenticated || hasGuestCartToken(),
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

/**
 * Merge guest cart into user cart (after login)
 */
export function useMergeCart() {
  const qc = useQueryClient();
  return useMutation<CartDTO, any, void>({
    mutationKey: ['mergeCart'],
    enabled: hasGuestCartToken(),
    mutationFn: async () => {
      const res = await api.post<ApiEnvelope<CartDTO>>('/api/customer/cart/merge');
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CART_KEYS.cart] });
      qc.invalidateQueries({ queryKey: [CART_KEYS.cartCount] });
      qc.refetchQueries({ queryKey: [CART_KEYS.cart] });
      qc.refetchQueries({ queryKey: [CART_KEYS.cartCount] });
    },
  });
}
