import { useMemo, useState } from 'react';
import { useProductAnalytics, type ProductAnalyticsRow } from '../../api/analyticsApi';

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
  const [productId, setProductId] = useState<string>('');
  const [from, setFrom] = useState<string>(sixMonthsAgo);
  const [to, setTo] = useState<string>(thisMonth);

  // Snapshot of the last executed params (used by sort/paging)
  const [lastParams, setLastParams] = useState<{
    productId?: number;
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

  const { data, isFetching, run } = useProductAnalytics();

  const rows: ProductAnalyticsRow[] = data?.content || [];
  const totalItems = data?.totalElements ?? 0;

  const handleSort = ({ field, order }: { field: string; order: number }) => {
    const nextSortField = field;
    const nextSortOrder: SortOrder = order > 0 ? 'desc' : 'asc';
    setSortField(nextSortField);
    setSortOrder(nextSortOrder);
    // If we already have a dataset, re-run with same filters
    if (lastParams) {
      const next = {
        ...lastParams,
        page: 0,
        sortBy: nextSortField as any,
        sortDirection: nextSortOrder.toUpperCase() as 'ASC' | 'DESC',
      };
      setLastParams(next);
      run(next);
    }
  };

  const applyFilters = () => {
    const next = {
      productId: productId ? Number(productId) : undefined,
      from,
      to,
      page: 0,
      size: rowsPerPage,
      sortBy: sortField as any,
      sortDirection: (sortOrder || 'desc').toUpperCase() as 'ASC' | 'DESC',
    };
    setLastParams(next);
    run(next);
  };

  const setPageWrapped = (newPage: number) => {
    if (!lastParams) return; // no-op until first Apply
    const next = {
      ...lastParams,
      page: Math.max(0, newPage - 1),
    };
    setLastParams(next);
    run(next);
  };

  return {
    // Draft input state (used in the UI controls)
    productId,
    setProductId,
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
    isFetching,
    applyFilters,
  };
};
