import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { ReviewDto, UseAdminReviewsParams } from './types/review';
import { useToast } from '@baby-toys/ui-kit';

function toUpper(val?: string) {
  return val ? val.toUpperCase() : val;
}

export const useAdminReviews = (params?: UseAdminReviewsParams) =>
  useQuery<Page<ReviewDto>>({
    queryKey: ['admin-reviews', params],
    keepPreviousData: true,
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Page<ReviewDto>>>('/api/admin/reviews', {
        params: {
          page: Math.max(0, (params?.page ?? 1) - 1),
          size: params?.size ?? 10,
          sortBy: params?.sortBy ?? 'createdAt',
          sortDirection: toUpper(params?.sortDirection ?? 'DESC'),
          productId: params?.productId,
          userId: params?.userId,
          rating: params?.rating,
          status: params?.status,
        },
      });
      return data.data;
    },
  });

export const useHideReview = () => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.put<ApiEnvelope<{ id: number }>>(`/api/admin/reviews/${id}/hide`);
      return data.data.id;
    },
    onSuccess: () => {
      toast.success('Review hidden');
      qc.invalidateQueries(['admin-reviews']);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to hide review'),
  });
};

export const useUnhideReview = () => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.put<ApiEnvelope<{ id: number }>>(
        `/api/admin/reviews/${id}/unhide`
      );
      return data.data.id;
    },
    onSuccess: () => {
      toast.success('Review unhidden');
      qc.invalidateQueries(['admin-reviews']);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to unhide review'),
  });
};
