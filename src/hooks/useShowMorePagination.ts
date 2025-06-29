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

export function useShowMorePagination<T, F = any>(
  fetchFunction: FetchFunction<T, F>,
  pageSize: number,
  initialFilters?: F
) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<F | undefined>(initialFilters);
  
  // Use ref to store the latest fetchFunction to prevent unnecessary re-renders
  const fetchFunctionRef = useRef(fetchFunction);
  fetchFunctionRef.current = fetchFunction;

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Fetch data when page or filters change
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { items: pagedItems, totalItems } = await fetchFunctionRef.current(page, filters);

        if (!isMounted) return;

        // For show-more: accumulate items, for page 1: replace all items
        setItems((prevItems) => (page === 1 ? pagedItems : [...prevItems, ...pagedItems]));
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
  }, [page, filters]); // Removed fetchFunction from dependencies

  // Handle pagination change (show more)
  const handlePaginationChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: F) => {
    setItems([]); // Clear items when filters change
    setFilters(newFilters);
  }, []);

  // Reset function to clear all data
  const reset = useCallback(() => {
    setPage(1);
    setItems([]);
    setTotalSize(0);
    setLoading(false);
  }, []);

  return {
    // Data
    items,
    totalSize,
    page,
    loading,
    filters,
    
    // Actions
    handlePaginationChange,
    handleFiltersChange,
    reset,
    
    // Computed values
    hasMore: items.length < totalSize,
    pageSize,
  };
}