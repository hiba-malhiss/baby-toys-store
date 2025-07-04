import { useState, useEffect, useCallback, useRef } from 'react';
import { isEqual } from '../util/isEqual.utils.ts';

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
  hasFilters: boolean,
  mode: 'default' | 'show-more' | 'infinite-scroll' = 'default'
) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<F | undefined>();

  const fetchFunctionRef = useRef(fetchFunction);
  fetchFunctionRef.current = fetchFunction;

  const previousFiltersRef = useRef<F | undefined>(undefined);
  const isFirstFiltersUpdate = useRef(true);

  useEffect(() => {
    if (isFirstFiltersUpdate.current) {
      isFirstFiltersUpdate.current = false;
      return; // skip first time filters effect
    }
    setPage(1);
  }, [filters]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(items.length == 0 || mode === 'default');
      try {
        const { items: pagedItems, totalItems } = await fetchFunctionRef.current(page, filters);
        if (!isMounted) return;

        setItems((prevItems) => {
          if (mode === 'show-more' || mode === 'infinite-scroll') {
            return page === 1 ? pagedItems : [...prevItems, ...pagedItems];
          }
          return pagedItems;
        });

        setTotalSize(totalItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!hasFilters || (hasFilters && filters)) fetchData();

    return () => {
      isMounted = false;
    };
  }, [page, filters, mode]);

  const handlePaginationChange = useCallback(
    (newPage: number) => {
      if (page === newPage) return;
      setPage(newPage);
    },
    [page]
  );

  const handleFiltersChange = useCallback((newFilters: F) => {
    if (isEqual(newFilters, previousFiltersRef.current)) return;
    previousFiltersRef.current = newFilters;
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
