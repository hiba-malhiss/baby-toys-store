import { useState, useEffect, useCallback } from 'react';
import { useMockAdminApi } from '@mock-data/useMockApi';
import { OrderItem } from '@baby-toys/types/src';

export const useOrdersData = () => {
  const { getOrders, updateOrderStatus } = useMockAdminApi();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  // Table control state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState(-1); // Default to descending for date
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Fetch data from API with current params
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // The mock getOrders function expects filters directly
      const response = await getOrders(page, pageSize, filters);
      setOrders(response.items);
      setTotalRecords(response.totalItems);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Debounce fetching to avoid excessive API calls on filter changes
    const handler = setTimeout(() => {
      fetchOrders();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [page, pageSize, filters]);

  // Handle order status update, then refresh list
  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders(); // Refresh the list to show the updated status
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
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
