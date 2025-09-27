import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useToast } from '@baby-toys/ui-kit';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { Order, OrderStatus } from './types/order';

export interface UseAdminOrdersParams {
  page?: number;
  size?: number;
  sortBy?: string;
  query?: string;
  status?: OrderStatus;
  sortDirection?: 'ASC' | 'DESC' | 'asc' | 'desc';
}

function toUpper(val?: string) {
  return val ? val.toUpperCase() : val;
}

export const useAdminOrders = (params?: UseAdminOrdersParams) =>
  useQuery<Page<Order>>({
    queryKey: [
      'admin-orders',
      Math.max(0, (params?.page ?? 1) - 1),
      params?.size ?? 10,
      params?.sortBy ?? 'createdAt',
      toUpper(params?.sortDirection ?? 'DESC'),
      params?.query ?? '',
      params?.status ?? '',
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Page<Order>>>('/api/admin/orders', {
        params: {
          page: Math.max(0, (params?.page ?? 1) - 1),
          size: params?.size ?? 10,
          sortBy: params?.sortBy ?? 'createdAt',
          sortDirection: toUpper(params?.sortDirection ?? 'DESC'),
          query: params?.query,
          status: params?.status,
        },
      });
      return data.data;
    },
  });

export const useAdminOrder = (orderId?: number) =>
  useQuery<Order>({
    queryKey: ['admin-order', orderId],
    enabled: !!orderId,
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Order>>(`/api/admin/orders/${orderId}`);
      return data.data;
    },
  });

// Mutations

export const useRemoveOrderItem = (orderId: number) => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (orderItemId: number) => {
      const { data } = await api.delete<ApiEnvelope<Order>>(
        `/api/admin/orders/${orderId}/items/${orderItemId}`
      );
      return data.data;
    },
    onSuccess: (updated) => {
      toast.success('Item removed');
      qc.setQueryData(['admin-order', orderId], updated);
      qc.invalidateQueries({ queryKey: ['admin-order', orderId] });
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to remove item'),
  });
};

export const useUpdateOrderItemQuantity = (orderId: number) => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async ({ orderItemId, quantity }: { orderItemId: number; quantity: number }) => {
      const { data } = await api.put<ApiEnvelope<Order>>(
        `/api/admin/orders/${orderId}/items/${orderItemId}`,
        { quantity }
      );
      return data.data;
    },
    onSuccess: (updated) => {
      toast.success('Quantity updated');
      qc.setQueryData(['admin-order', orderId], updated);
      qc.invalidateQueries({ queryKey: ['admin-order', orderId] });
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to update quantity'),
  });
};

export const useApplyOrderCoupon = (orderId: number) => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (code: string) => {
      const { data } = await api.post<ApiEnvelope<Order>>(
        `/api/admin/orders/${orderId}/coupon`,
        undefined,
        { params: { code } }
      );
      return data.data;
    },
    onSuccess: (updated) => {
      toast.success('Coupon applied');
      qc.setQueryData(['admin-order', orderId], updated);
      qc.invalidateQueries({ queryKey: ['admin-order', orderId] });
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to apply coupon'),
  });
};

export const useRemoveOrderCoupon = (orderId: number) => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<ApiEnvelope<Order>>(`/api/admin/orders/${orderId}/coupon`);
      return data.data;
    },
    onSuccess: (updated) => {
      toast.success('Coupon removed');
      qc.setQueryData(['admin-order', orderId], updated);
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to remove coupon'),
  });
};

export const useUpdateOrderStatus = (orderId: number) => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (status: OrderStatus) => {
      const { data } = await api.put<ApiEnvelope<Order>>(`/api/admin/orders/${orderId}/status`, {
        status,
      });
      return data.data;
    },
    onSuccess: (updated) => {
      toast.success('Status updated');
      qc.setQueryData(['admin-order', orderId], updated);
      qc.invalidateQueries({ queryKey: ['admin-order', orderId] });
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to update status'),
  });
};
