import { useState, useEffect, useMemo } from 'react';

type PaginationMode = 'default' | 'show-more';

export function useOfflinePagination<T>(
  items: T[],
  pageSize: number,
  initialPage = 1,
  mode: PaginationMode = 'default'
) {
  const totalPages = Math.ceil(items.length / pageSize);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const paginatedItems = useMemo(() => {
    if (mode === 'show-more') {
      // show all items from page 1 up to current page * pageSize
      return items.slice(0, page * pageSize);
    }
    // default: slice items for current page only
    const startIdx = (page - 1) * pageSize;
    return items.slice(startIdx, startIdx + pageSize);
  }, [items, page, pageSize, mode]);

  const hasMore = page < totalPages;

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const showMore = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return {
    totalSize: items.length,
    items: paginatedItems,
    page,
    totalPages,
    hasMore,
    goToPage,
    showMore,
  };
}
