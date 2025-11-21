import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@baby-toys/ui-kit';
import api from './axiosConfig';
import type { Page } from './types/common.ts';

export type OrderItemDTO = {
  id: number;
  productId: number;
  productName: string;
  mainImage: string;
  quantity: number;
  originalPrice: number;
  pricePerUnit: number;
  totalPrice: number;
  hasReview?: boolean;
  canReview?: boolean;
  canEditReview?: boolean;
  reviewId?: number;
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

// ===== Normalization for UI consumers =====
export type OrderItem = {
  orderItemId: string;
  productId: string;
  originalPrice?: number | null;
  pricePerUnit?: number | null;
  totalPrice: number;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    mainImage: string;
  };
  isReviewed: boolean;
  hasReview?: boolean;
  canReview?: boolean;
  canEditReview?: boolean;
  reviewId?: number;
};

export type Order = {
  id: string;
  date: string;
  status: string; // lowercase for UI color maps
  statusEnum: OrderStatus;
  cartItems: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  couponCode?: string | null;
};

function parseOrderStatus(s?: string): OrderStatus {
  const key = (s || '').toUpperCase() as keyof typeof OrderStatus;
  return OrderStatus[key] ?? OrderStatus.PENDING;
}

export function normalizeOrder(dto: OrderDTO): Order {
  return {
    id: String(dto.id),
    date: dto.createdAt,
    status: dto.status?.toLowerCase?.() || dto.status,
    statusEnum: parseOrderStatus(dto.status),
    cartItems: (dto.items || []).map((it) => ({
      orderItemId: String(it.id),
      productId: String(it.productId),
      quantity: it.quantity,
      product: {
        id: String(it.productId),
        name: it.productName,
        price: Number(it.pricePerUnit),
        originalPrice: it.originalPrice,
        mainImage: it.mainImage,
      },
      isReviewed: !!it.hasReview,
      hasReview: it.hasReview,
      canReview: it.canReview,
      canEditReview: it.canEditReview ?? it.canReview,
      reviewId: it.reviewId,
      totalPrice: Number(it.totalPrice || 0),
    })),
    subtotal: Number(dto.subtotal || 0),
    shippingCost: Number((dto as any).shippingCost ?? 0),
    discountAmount: Number(dto.discountAmount || 0),
    total: Number(dto.total || 0),
    couponCode: dto.couponCode ?? null,
  };
}

export function useMyOrdersNormalized(params: {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  month?: string; // format: YYYY-MM
}) {
  const { page, size, sortBy = 'createdAt', sortDirection = 'DESC', month } = params;
  return useQuery<Page<Order>>({
    queryKey: ['customer-orders-normalized', page, size, sortBy, sortDirection, month ?? null],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get<{ data: Page<OrderDTO> }>(`/api/customer/orders`, {
        params: { page: Math.max(0, page - 1), size, sortBy, sortDirection, month },
      });
      const raw = data.data;
      return {
        ...raw,
        content: raw.content.map(normalizeOrder),
      };
    },
  });
}
