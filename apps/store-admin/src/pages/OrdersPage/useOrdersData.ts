import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../api/apiClient';
import { useMockAdminApi } from '@mock-data/useMockApi';

export const useOrdersData = () => {
  const { getOrders, updateOrderStatus } = useMockAdminApi();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  // Table control state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState(1);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  // Fetch data from API with current params
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize,
        sortField,
        sortOrder,
        filters,
      };
      const response = await apiClient.get(getOrders, params);
      setOrders(response.items);
      setTotalRecords(response.totalRecords);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortField, sortOrder, filters, getOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle order status update, then refresh list
  const handleStatusChange = (orderId: number, status: string) => {
    apiClient.put(updateOrderStatus, orderId, status).then(() => {
      fetchOrders();
    });
  };

  return {
    orders,
    loading,
    totalRecords,
    page,
    pageSize,
    sortField,
    sortOrder,
    filters,
    setPage,
    setPageSize,
    setSortField,
    setSortOrder,
    setFilters,
    handleStatusChange,
  };
};
