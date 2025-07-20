import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMockAdminApi } from '@mock-data/useMockApi';
import { OrderItem } from '@baby-toys/types/src';

export const useOrdersData = () => {
  const { getOrders } = useMockAdminApi();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState(-1);

  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<Record<string, any>>(() => {
    const params: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  });

  const [pendingFilters, setPendingFilters] = useState<Record<string, any>>(filters);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));

      const response = await getOrders(page, pageSize, cleanFilters);
      setOrders(response.items);
      setTotalRecords(response.totalItems);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, getOrders]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, String(value));
      } else {
        newSearchParams.delete(key);
      }
    });
    setSearchParams(newSearchParams);

    fetchOrders();
  }, [filters, page, pageSize, setSearchParams]);

  return {
    orders,
    loading,
    totalRecords,
    page,
    pageSize,
    sortField,
    sortOrder,
    filters,
    pendingFilters,
    setPage,
    setPageSize,
    setSortField,
    setSortOrder,
    setFilters,
    setPendingFilters,
  };
};
