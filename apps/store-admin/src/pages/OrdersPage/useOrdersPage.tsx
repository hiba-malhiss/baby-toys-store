import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteOrder, useAdminOrders } from '../../api/ordersApi';
import type { Order } from '../../api/types/order';
import { statusColorMap } from './orders-page.utils';
import { formatNumber } from '@baby-toys/ui-kit/utils';
import { useAdminStoreConfiguration } from '../../context/StoreConfigurationContext.tsx';
import { Chip, Flex, Button } from '@baby-toys/ui-kit/components';
import { faEye, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export const useOrdersPage = () => {
  const navigate = useNavigate();
  const deleteOrder = useDeleteOrder();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const [orderNumber, setOrderNumber] = useState();
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<-1 | 1>(-1);
  const { currency } = useAdminStoreConfiguration();

  const { data, isLoading } = useAdminOrders({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDirection: sortOrder === 1 ? 'ASC' : 'DESC',
    orderNumber,
    status: statusFilter,
  });

  const orders = useMemo(() => data?.content ?? [], [data]);
  const totalRecords = data?.totalElements ?? 0;

  const handleSort = useCallback(({ field, order }: { field: string; order: number }) => {
    setSortField(field);
    setSortOrder(order);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  const columns = useMemo(
    () => [
      { field: 'orderNumber', header: 'Order #', sortable: true },
      {
        field: 'createdAt',
        header: 'Date',
        sortable: true,
        body: (row: Order) => new Date(row.createdAt).toLocaleString(),
      },
      {
        field: 'total',
        header: 'Total',
        sortable: true,
        body: (row: Order) => formatNumber(row.total, currency?.currency),
      },
      {
        field: 'status',
        header: 'Status',
        body: (row: Order) => <Chip label={row.status} appearance={statusColorMap[row.status]} />,
      },
      {
        field: 'actions',
        header: 'Actions',
        body: (row: Order) => (
          <Flex spacing="m">
            <Button
              size="small"
              appearance="outline"
              leftIcon={faEye}
              onClick={() => navigate(`/order-details/${row.id}`)}
            />
            <Button
              size="small"
              appearance="outline"
              leftIcon={faPen}
              onClick={() => navigate(`/order-edit/${row.id}`)}
            />
            <Button
              size="small"
              appearance="outline"
              leftIcon={faTrashAlt}
              onClick={() => {
                setOrderToDelete(row);
                setConfirmVisible(true);
              }}
            />
          </Flex>
        ),
      },
    ],
    [navigate, currency]
  );

  const confirmDelete = useCallback(() => {
    if (orderToDelete) deleteOrder.mutate(orderToDelete.id);
    setConfirmVisible(false);
    setOrderToDelete(null);
  }, [orderToDelete, deleteOrder]);

  const cancelDelete = useCallback(() => {
    setConfirmVisible(false);
    setOrderToDelete(null);
  }, []);

  const handleSearch = (value: string) => {
    setOrderNumber(value);
    setPage(1);
  };
  const selectStatus = (status?: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  return {
    orders,
    totalRecords,
    pageSize,
    sortField,
    sortOrder,
    loading: isLoading,
    columns,
    confirmVisible,
    orderToDelete,
    handleSort,
    handlePageChange,
    confirmDelete,
    cancelDelete,
    handleSearch,
    statusFilter,
    setStatusFilter: selectStatus,
  };
};
