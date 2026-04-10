/**
 * Memory Deck API — React Query hooks
 * Mirrors the pattern in boardApi.ts
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';

// ─── Server DTOs ──────────────────────────────────────────────────────

export type MemoryPairDto = {
  id: string;
  equation: string;
  answer: string;
};

export type MemoryDeckSummaryDto = {
  id: string;
  name: string;
  pairCount: number;
  createdAt: number;
  updatedAt: number;
};

export type MemoryDeckDetailDto = {
  id: string;
  name: string;
  pairs: MemoryPairDto[];
  createdAt: number;
  updatedAt: number;
};

export type MemoryDeckCreateDto = {
  name: string;
  pairs: Omit<MemoryPairDto, 'id'>[];
};

export type MemoryDeckUpdateDto = MemoryDeckCreateDto;

export type PageDto<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

// ─── Query keys ───────────────────────────────────────────────────────

export const memoryKeys = {
  all: ['memory-decks'] as const,
  list: (p: MemoryListParams) => ['memory-decks', 'list', p] as const,
  detail: (id: string | null) => ['memory-decks', 'detail', id] as const,
};

type MemoryListParams = { page: number; size: number };

// ─── Queries ──────────────────────────────────────────────────────────

export function useMemoryDecksQuery(params: MemoryListParams = { page: 0, size: 50 }) {
  return useQuery({
    queryKey: memoryKeys.list(params),
    queryFn: () =>
      api
        .get<{ success: boolean; data: PageDto<MemoryDeckSummaryDto> }>('/api/memory-decks', {
          params,
        })
        .then((r) => r.data.data),
  });
}

export function useMemoryDeckDetailQuery(id: string | null) {
  return useQuery({
    queryKey: memoryKeys.detail(id),
    queryFn: () =>
      api
        .get<{ success: boolean; data: MemoryDeckDetailDto }>(`/api/memory-decks/${id}`)
        .then((r) => r.data.data),
    enabled: id !== null,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateMemoryDeck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MemoryDeckCreateDto) =>
      api
        .post<{ success: boolean; data: MemoryDeckDetailDto }>('/api/admin/memory-decks', payload)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: memoryKeys.all }),
  });
}

export function useUpdateMemoryDeck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MemoryDeckUpdateDto }) =>
      api
        .put<{ success: boolean; data: MemoryDeckDetailDto }>(`/api/admin/memory-decks/${id}`, payload)
        .then((r) => r.data.data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: memoryKeys.all });
      qc.invalidateQueries({ queryKey: memoryKeys.detail(id) });
    },
  });
}

export function useDeleteMemoryDeck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/memory-decks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: memoryKeys.all }),
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────

/** Default pairs shown before any decks exist */
export const DEFAULT_PAIRS: MemoryPairDto[] = [
  { id: 'p1', equation: '2 + 2', answer: '4' },
  { id: 'p2', equation: '3 × 3', answer: '9' },
  { id: 'p3', equation: '10 − 3', answer: '7' },
  { id: 'p4', equation: '8 ÷ 2', answer: '4' },
  { id: 'p5', equation: '5 + 6', answer: '11' },
  { id: 'p6', equation: '4 × 4', answer: '16' },
  { id: 'p7', equation: '20 − 8', answer: '12' },
  { id: 'p8', equation: '15 ÷ 3', answer: '5' },
  { id: 'p9', equation: '7 + 8', answer: '15' },
  { id: 'p10', equation: '6 × 5', answer: '30' },
  { id: 'p11', equation: '100 − 45', answer: '55' },
  { id: 'p12', equation: '81 ÷ 9', answer: '9' },
];
