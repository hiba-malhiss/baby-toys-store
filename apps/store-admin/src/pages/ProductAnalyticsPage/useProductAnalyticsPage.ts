import { useMemo, useState } from 'react';
import { useProductAnalyticsMutation, type ProductAnalyticsRow } from '../../api/analyticsApi';

export type SortOrder = 'asc' | 'desc';
const rowsPerPage = 50;
export const useProductAnalyticsPage = () => {
  const today = useMemo(() => new Date(), []);
  const thisMonth = useMemo(() => today.toISOString().slice(0, 7), [today]);
  const sixMonthsAgo = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() - 5);
    return d.toISOString().slice(0, 7);
  }, [today]);

  // Draft input (used by the UI, does not trigger query until Apply)
  const [productQuery, setProductQuery] = useState<string>('');
  const [from, setFrom] = useState<string>(sixMonthsAgo);
  const [to, setTo] = useState<string>(thisMonth);

  // Snapshot of the last executed params (used by sort/paging)
  const [lastParams, setLastParams] = useState<{
    query?: string;
    from: string;
    to: string;
    page: number; // 0-based
    size: number;
    sortBy: string;
    sortDirection: 'ASC' | 'DESC';
  } | null>(null);

  // 1-based page index to align with UI Kit Table paginator
  const [sortField, setSortField] = useState<string>('year');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data, isPending, mutateAsync } = useProductAnalyticsMutation();

  const rows: ProductAnalyticsRow[] = data?.content || [];
  const totalItems = data?.totalElements ?? 0;

  const handleSort = ({ field, order }: { field: string; order: number }) => {
    const nextSortField = field;
    const nextSortOrder: SortOrder = order > 0 ? 'desc' : 'asc';
    setSortField(nextSortField);
    setSortOrder(nextSortOrder);
    // If we already have a dataset, re-run with same filters
    if(lastParams) {
      const next = {
        ...lastParams,
        page: 0,
        sortBy: nextSortField as any,
        sortDirection: nextSortOrder.toUpperCase() as 'ASC' | 'DESC',
      };
      setLastParams(next);
      mutateAsync(next);
    }
  }

  const applyFilters = () => {
    const trimmed = (productQuery || '').trim();
    const next = {
      query: trimmed || undefined,
      from,
      to,
      page: 0,
      size: rowsPerPage,
      sortBy: sortField as any,
      sortDirection: (sortOrder || 'desc').toUpperCase() as 'ASC' | 'DESC',
    };
    setLastParams(next);
    mutateAsync(next);
  };

  const setPageWrapped = (newPage: number) => {
    if(!lastParams) return; // no-op until first Apply
    const next = {
      ...lastParams,
      page: Math.max(0, newPage - 1),
    };
    setLastParams(next);
    mutateAsync(next);
  };

  return {
    // Draft input state (used in the UI controls)
    productQuery,
    setProductQuery,
    from,
    setFrom,
    to,
    setTo,
    // Sorting/paging
    sortField,
    sortOrder,
    handleSort,
    setPage: setPageWrapped,
    rows,
    totalItems,
    isFetching: !!isPending,
    applyFilters,
  };
};
