import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { ReviewDto } from './types/reviews.ts';
import { useToast } from '@baby-toys/ui-kit';

// Fallback mock reviews
const MOCK_REVIEW_DTOS: ReviewDto[] = [
  {
    id: 1,
    rating: 5,
    userName: 'Emily Johnson',
    userEmail: 'emily@example.com',
    comment: 'My kids love the toys! Great quality and fast shipping.',
    createdAt: '2025-01-01T12:00:00Z',
  },
  {
    id: 2,
    rating: 4,
    userName: 'Liam Smith',
    userEmail: 'liam@example.com',
    comment: 'Good variety and reasonable prices.',
    createdAt: '2025-01-02T12:00:00Z',
  },
  {
    id: 3,
    rating: 4,
    userName: 'Ava Brown',
    userEmail: 'ava@example.com',
    comment: 'Nice packaging and friendly customer service.',
    createdAt: '2025-01-03T12:00:00Z',
  },
  {
    id: 4,
    rating: 5,
    userName: 'Noah Davis',
    userEmail: 'noah@example.com',
    comment: 'Fantastic experience! I’ll definitely order again.',
    createdAt: '2025-01-04T12:00:00Z',
  },
  {
    id: 5,
    rating: 4,
    userName: 'Sophia Wilson',
    userEmail: 'sophia@example.com',
    comment: 'The website is easy to navigate and delivery was quick.',
    createdAt: '2025-01-05T12:00:00Z',
  },
  {
    id: 6,
    rating: 5,
    userName: 'Oliver Taylor',
    userEmail: 'oliver@example.com',
    comment: 'Excellent quality and fast delivery!',
    createdAt: '2025-01-06T12:00:00Z',
  },
];

const adaptDtoToReview = (dto: ReviewDto): ReviewDto => ({
  id: String(dto.id),
  name: dto.userName || dto.userEmail || 'Anonymous',
  rating: Number(dto.rating ?? 0),
  comment: dto.comment || '',
  date: dto.createdAt,
  avatarUrl: '',
});

// There should be 6 reviews at least so read from backend and fill from mock if needed
export const useHighlightedReviews = (minRating = 4, size = 10, minDisplay = 6) => {
  return useQuery<ReviewDto[]>({
    queryKey: ['highlightedReviews', minRating, size, minDisplay],
    queryFn: async () => {
      try {
        const res = await api.get<ApiEnvelope<Page<ReviewDto>>>('/api/reviews/highlights', {
          params: { minRating, size },
        });
        const dtos = res.data.data?.content || [];

        // Fill with placeholders if needed
        const reviewsNeeded = Math.max(0, minDisplay - dtos.length);
        const finalDtos =
          reviewsNeeded > 0 ? dtos.concat(MOCK_REVIEW_DTOS.slice(0, reviewsNeeded)) : dtos;

        return finalDtos.map(adaptDtoToReview);
      } catch (e) {
        // If backend fails, fallback to mock reviews
        return MOCK_REVIEW_DTOS.slice(0, minDisplay).map(adaptDtoToReview);
      }
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
