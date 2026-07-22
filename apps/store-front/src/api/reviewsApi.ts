import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { ReviewDto } from './types/reviews.ts';
import { useToast } from '@baby-toys/ui-kit';

const adaptDtoToReview = (dto: ReviewDto): ReviewDto => ({
  id: String(dto.id),
  name: dto.userName || dto.userEmail || "Anonymous",
  rating: Number(dto.rating ?? 0),
  comment: dto.comment || "",
  date: dto.createdAt,
  avatarUrl: "",
});

export const useHighlightedReviews = (minRating = 4, size = 10) => {
  return useQuery<ReviewDto[]>({
    queryKey: ["highlightedReviews", minRating, size],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Page<ReviewDto>>>("/api/reviews/highlights", {
        params: { minRating, size },
      });
      const dtos = res.data.data?.content || [];
      return dtos.map(adaptDtoToReview);
    },
    staleTime: 60_000,
  });
};

export function useProductReviews(productId: string | number, page: number, size: number) {
  return useQuery({
    queryKey: ['productReviews', productId, page, size],
    queryFn: async () => {
      if (!productId) return { items: [], page, totalPages: 0, totalElements: 0 };

      const res = await api.get<ApiEnvelope<Page<ReviewDto>>>(
        `/api/products/${productId}/reviews`,
        {
          params: { page: Math.max(0, page - 1), size, sortBy: 'createdAt', sortDirection: 'DESC' },
        }
      );

      const pg = res.data.data;
      const items = (pg?.content || []).map(adaptDtoToReview);

      return {
        items,
        page,
        totalPages: pg?.totalPages ?? 0,
        totalElements: pg?.totalElements ?? 0,
      };
    },
    keepPreviousData: true,
    staleTime: 60_000,
    enabled: Boolean(productId),
  });
}

export function useGetMyReview(reviewId?: number | null, enabled: boolean = true) {
  return useQuery<{ id: number; rating: number; comment: string | null }>({
    queryKey: ['myReview', reviewId],
    enabled: Boolean(reviewId) && enabled,
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<ReviewDto>>(`/api/customer/reviews/${reviewId}`);
      const dto = res.data.data as ReviewDto;
      return {
        id: Number(dto.id),
        rating: Number(dto.rating || 1),
        comment: dto.comment ?? '',
      };
    },
    staleTime: 30_000,
  });
}

export interface CreateReviewRequest {
  orderItemId: number;
  productId: number;
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  id: number;
  rating?: number;
  comment?: string;
}

export function useCreateReview() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (payload: CreateReviewRequest) => {
      const res = await api.post<ApiEnvelope<{ id: number }>>('/api/customer/reviews', payload);
      return res.data.data?.id;
    },
    onSuccess: () => {
      // Invalidate generic review-related queries (optional)
      qc.invalidateQueries({ queryKey: ['highlightedReviews'] });
      // Refresh order history so buttons/state update (hasReview/canReview)
      qc.invalidateQueries({ queryKey: ['customer-orders-normalized'] });
      qc.invalidateQueries({ queryKey: ['customer-orders'] });
      toast.success('Review created');
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || 'Failed to create review');
    },
  });
}

export function useUpdateMyReview() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async (payload: UpdateReviewRequest) => {
      const { id, ...body } = payload;
      const res = await api.put<ApiEnvelope<{ id: number }>>(`/api/customer/reviews/${id}`, body);
      return res.data.data?.id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['highlightedReviews'] });
      qc.invalidateQueries({ queryKey: ['customer-orders-normalized'] });
      qc.invalidateQueries({ queryKey: ['customer-orders'] });
      toast.success('Review updated');
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || 'Failed to update review');
    },
  });
}
