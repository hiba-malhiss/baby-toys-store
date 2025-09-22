import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CouponDto, CreateCouponRequest, UpdateCouponRequest } from './types/coupon';
import api from './axiosConfig';

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
    queryFn: () => api.get(ADMIN_BASE_URL, { params }).then((res) => res.data.data),
  });

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation<CouponDto, Error, CreateCouponRequest>({
    mutationFn: (data) => api.post(ADMIN_BASE_URL, data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation<CouponDto, Error, { id: number; data: UpdateCouponRequest }>({
    mutationFn: ({ id, data }) => api.put(`${ADMIN_BASE_URL}/${id}`, data).then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['coupons', id] });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`${ADMIN_BASE_URL}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  });
};
