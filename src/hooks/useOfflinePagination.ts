import { useState, useEffect, useCallback } from 'react';

type PaginationMode = 'default' | 'show-more';

export function useOfflinePagination<T>(
  fetchPage: (page: number, pageSize: number) => Promise<{ items: T[]; page: number; totalPages: number; totalItems: number }>,
  pageSize: number,
  paginationMode: PaginationMode = 'default'
) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAndSet = useCallback(async () => {
    setLoading(true);
    const data = await fetchPage(page, pageSize);
    setTotalSize(data.totalItems);
    setTotalPages(data.totalPages);
    setItems((prev) =>
      paginationMode === 'show-more' && page > 1 ? [...prev, ...data.items] : data.items
    );
    setLoading(false);
  }, [fetchPage, page, pageSize, paginationMode]);

  useEffect(() => {
    fetchAndSet();
    // eslint-disable-next-line
  }, [page, pageSize, fetchAndSet]);

  const showMore = useCallback(() => {
    if (page < totalPages) setPage((p) => p + 1);
  }, [page, totalPages]);

  return {
    items,
    page,
    totalPages,
    totalSize,
    loading,
    setPage,
    showMore,
    hasMore: page < totalPages,
  };
}
