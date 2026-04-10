/**
 * Board API — React Query hooks
 * Base URL is read from VITE_API_BASE_URL (defaults to /api)
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';

const http = api;

// ─── Types (server shape) ─────────────────────────────────────────────

export type BoardSummaryDto = {
  id: number;
  name: string;
  width: number;
  height: number;
  isActive: boolean;
  imageUrl?: string;
};

export type BoardDetailDto = BoardSummaryDto & {
  colors: { id: string; hex: string; equation: string; sortOrder: number }[];
  solution: { cellIndex: number; splitMode: string; top: string | null; bottom: string | null }[];
  createdAt: number;
  updatedAt: number;
};

export type PageDto<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

// ─── Query keys ───────────────────────────────────────────────────────

export const boardKeys = {
  all: ['boards'] as const,
  list: (p: BoardListParams) => ['boards', 'list', p] as const,
  detail: (id: number | null) => ['boards', 'detail', id] as const,
};

type BoardListParams = { page: number; size: number; sortBy?: string; sortDir?: string };

// ─── Queries ──────────────────────────────────────────────────────────

export function useBoardsQuery(params: BoardListParams) {
  return useQuery({
    queryKey: boardKeys.list(params),
    queryFn: () =>
      http
        .get<{ success: boolean; data: PageDto<BoardSummaryDto> }>('/api/boards', { params })
        .then((r) => r.data.data),
  });
}

export function useBoardDetailQuery(id: number | null) {
  return useQuery({
    queryKey: boardKeys.detail(id),
    queryFn: () =>
      http
        .get<{ success: boolean; data: BoardDetailDto }>(`/api/boards/${id}`)
        .then((r) => r.data.data),
    enabled: id !== null,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      http
        .post<{ success: boolean; data: BoardDetailDto }>('/api/admin/boards', payload)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: boardKeys.all }),
  });
}

export function useUpdateBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      http
        .put<{ success: boolean; data: BoardDetailDto }>(`/api/admin/boards/${id}`, payload)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: boardKeys.all }),
  });
}

export function useDeleteBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => http.delete(`/api/admin/boards/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: boardKeys.all }),
  });
}
