import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@baby-toys/ui-kit/components';
import api from './axiosConfig';
import type { ApiEnvelope, Page, Order, OrderStatus } from './types/order';

export interface UseAdminOrdersParams {
  page?: number;
  size?: number;
  sortBy?: string;
  orderNumber?: string;
  status?: OrderStatus;
  sortDirection?: 'ASC' | 'DESC' | 'asc' | 'desc';
}

function toUpper(val?: string) {
  return val ? val.toUpperCase() : val;
}

export const useAdminOrders = (params?: UseAdminOrdersParams) =>
  useQuery<Page<Order>>({
    queryKey: ['admin-orders', params],
    keepPreviousData: true,
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Page<Order>>>('/api/admin/orders', {
        params: {
          page: Math.max(0, (params?.page ?? 1) - 1),
          size: params?.size ?? 10,
          sortBy: params?.sortBy ?? 'createdAt',
          sortDirection: toUpper(params?.sortDirection ?? 'DESC'),
          orderNumber: params?.orderNumber,
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
export const useDeleteOrder = () => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const { data } = await api.delete<ApiEnvelope<void>>(`/api/admin/orders/${orderId}`);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Order deleted');
      qc.invalidateQueries(['admin-orders']);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to delete order'),
  });
};

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
      qc.invalidateQueries(['admin-orders']);
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
      qc.invalidateQueries(['admin-orders']);
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
      qc.invalidateQueries(['admin-orders']);
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
      qc.invalidateQueries(['admin-orders']);
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
      qc.invalidateQueries(['admin-orders']);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to update status'),
  });
};
