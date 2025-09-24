import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CouponDto, CreateCouponRequest, UpdateCouponRequest } from './types/coupon';
import api from './axiosConfig';
import { ApiEnvelope } from './types/common';

const ADMIN_BASE_URL = '/api/admin/coupons';

export const useCoupons = (params: {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  code?: string;
}) =>
  useQuery({
    queryKey: ['coupons', params],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ content: CouponDto[]; totalElements: number; totalPages: number; size: number; number: number }>>(
        ADMIN_BASE_URL,
        { params }
      );
      return res.data.data;
    },
  });

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation<number, Error, CreateCouponRequest>({
    mutationFn: async (data) => {
      const res = await api.post<ApiEnvelope<{ id: number }>>(ADMIN_BASE_URL, data);
      return res.data.data.id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation<number, Error, { id: number; data: UpdateCouponRequest }>({
    mutationFn: async ({ id, data }) => {
      const res = await api.put<ApiEnvelope<{ id: number }>>(`${ADMIN_BASE_URL}/${id}`, data);
      return res.data.data.id;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['coupons', id] });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation<number, Error, number>({
    mutationFn: async (id) => {
      const res = await api.delete<ApiEnvelope<{ id: number }>>(`${ADMIN_BASE_URL}/${id}`);
      return res.data.data.id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  });
};
