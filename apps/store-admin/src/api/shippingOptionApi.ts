import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';

export type ShippingOption = {
  id: number;
  name: string;
  description?: string | null;
  cost: number;
  active: boolean;
};

const ADMIN_BASE = '/api/admin/shipping-options';

export function useShippingOptions(params: {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}) {
  const { page, size, sortBy = 'id', sortDirection = 'ASC' } = params;
  return useQuery({
    queryKey: ['admin-shipping-options', page, size, sortBy, sortDirection],
    queryFn: async () => {
      const { data } = await api.get<
        ApiEnvelope<{
          content: ShippingOption[];
          totalElements: number;
          totalPages: number;
          number: number;
          size: number;
        }>
      >(ADMIN_BASE, { params: { page: Math.max(0, page - 1), size, sortBy, sortDirection } });
      return data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateShippingOption() {
  const qc = useQueryClient();
  return useMutation<number, any, Omit<ShippingOption, 'id'>>({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiEnvelope<{ id: number }>>(ADMIN_BASE, payload);
      return data.data.id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-shipping-options'] });
    },
  });
}

export function useUpdateShippingOption() {
  const qc = useQueryClient();
  return useMutation<number, any, { id: number; data: Omit<ShippingOption, 'id'> }>({
    mutationFn: async ({ id, data: payload }) => {
      const { data } = await api.put<ApiEnvelope<{ id: number }>>(`${ADMIN_BASE}/${id}`, payload);
      return data.data.id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-shipping-options'] });
    },
  });
}

export function useDeleteShippingOption() {
  const qc = useQueryClient();
  return useMutation<number, any, number>({
    mutationFn: async (id) => {
      const { data } = await api.delete<ApiEnvelope<{ id: number }>>(`${ADMIN_BASE}/${id}`);
      return data.data.id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-shipping-options'] });
    },
  });
}
