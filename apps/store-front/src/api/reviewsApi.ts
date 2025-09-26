import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { ReviewDto } from './types/reviews.ts';

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
