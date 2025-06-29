import { useState, useEffect, useCallback, useRef } from 'react';

type FetchFunction<T, F> = (
  page: number,
  filters?: F
) => Promise<{
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}>;

export function useHandlePagination<T, F = any>(
  fetchFunction: FetchFunction<T, F>,
  pageSize: number,
  initialFilters?: F,
  mode: 'default' | 'show-more' = 'default'
) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<F | undefined>(initialFilters);

  const fetchFunctionRef = useRef(fetchFunction);
  fetchFunctionRef.current = fetchFunction;

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { items: pagedItems, totalItems } = await fetchFunctionRef.current(page, filters);
        if (!isMounted) return;

        setItems((prevItems) => {
          if (mode === 'show-more') {
            return page === 1 ? pagedItems : [...prevItems, ...pagedItems];
          }
          return pagedItems; // Default mode: always replace
        });

        setTotalSize(totalItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [page, filters, mode]);

  const handlePaginationChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleFiltersChange = useCallback((newFilters: F) => {
    setItems([]);
    setFilters(newFilters);
  }, []);

  const reset = useCallback(() => {
    setPage(1);
    setItems([]);
    setTotalSize(0);
    setLoading(false);
  }, []);

  return {
    items,
    totalSize,
    page,
    pageSize,
    loading,
    filters,
    hasMore: items.length < totalSize,

    handlePaginationChange,
    handleFiltersChange,
    reset,
  };
}
