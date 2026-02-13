import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@baby-toys/ui-kit';
import api from './axiosConfig';
import type { Page } from './types/common.ts';

export type OrderItemDTO = {
  id: number;
  productId: number;
  productName: string;
  mainImage: string;
  variantId: number;
  variantSku: string;
  variantOptions: string[];
  quantity: number;
  originalPrice: number | null;
  pricePerUnit: number;
  totalPrice: number;
  hasReview?: boolean;
  canReview?: boolean;
  canEditReview?: boolean;
  reviewId?: number | null;
};

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export type OrderDTO = {
  id: number;
  orderNumber: string;
  createdAt: string;
  deliveredAt?: string | null;
  status: OrderStatus;
  subtotal: number;
  discountAmount?: number | null;
  total: number;
  couponCode?: string | null;
  items: OrderItemDTO[];
};

export function useCancelMyOrder() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const { data } = await api.post<{ data: { id: number } }>(
        `/api/customer/orders/${orderId}/cancel`
      );
      return data.data.id;
    },
    onSuccess: () => {
      toast.success('Order cancelled successfully');
      // Invalidate all known variants of the orders query keys
      qc.invalidateQueries({ queryKey: ['customer-orders'] });
      qc.invalidateQueries({ queryKey: ['customer-orders-normalized'] });
      qc.invalidateQueries({ queryKey: ['customer/orders'] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || 'Failed to cancel order');
    },
  });
}

export function useMyOrdersNormalized(params: {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  month?: string; // format: YYYY-MM
}) {
  const { page, size, sortBy = 'createdAt', sortDirection = 'DESC', month } = params;
  return useQuery<Page<OrderDTO>>({
    queryKey: ['customer-orders', page, size, sortBy, sortDirection, month ?? null],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get<{ data: Page<OrderDTO> }>(`/api/customer/orders`, {
        params: { page: Math.max(0, page - 1), size, sortBy, sortDirection, month },
      });
      return data.data;
    },
  });
}
