import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminOrders } from '../../api/ordersApi';
import type { Order } from '../../api/types/order';
import { statusColorMap } from './orders-page.utils';
import { formatNumber } from '@baby-toys/ui-kit/utils';
import { Chip, Flex, Button } from '@baby-toys/ui-kit';
import { faEye, faPen } from '@fortawesome/free-solid-svg-icons';

export const useOrdersPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = React.useState(searchParams.get('query') || '');
  const [query, setQuery] = useState<string | undefined>(searchParams.get('query') || undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<-1 | 1>(-1);

  useEffect(() => {
    const qp = searchParams.get('query') || '';
    const spStatus = searchParams.get('status') || undefined;
    setSearchValue(qp);
    setQuery(qp || undefined);
    setStatusFilter(spStatus || undefined);
  }, [searchParams]);

  const { data, isLoading } = useAdminOrders({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDirection: sortOrder === 1 ? 'ASC' : 'DESC',
    query,
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
        field: 'couponCode',
        header: 'Coupon',
        sortable: false,
        body: (row: Order) => row.couponCode || '-',
      },
      {
        field: 'discountAmount',
        header: 'Discount',
        sortable: true,
        body: (row: Order) => (row.discountAmount ? `-${formatNumber(row.discountAmount)}` : '-'),
      },
      {
        field: 'total',
        header: 'Total',
        sortable: true,
        body: (row: Order) => formatNumber(row.total),
      },
      {
        field: 'totalCost',
        header: 'Total Cost',
        sortable: false,
        body: (row: Order) => (row.totalCost != null ? formatNumber(row.totalCost) : '-'),
      },
      {
        field: 'totalProfit',
        header: 'Profit',
        sortable: false,
        body: (row: Order) => (row.totalProfit ? formatNumber(row.totalProfit) : '-'),
      },
      {
        field: 'profitMargin',
        header: 'Margin',
        sortable: false,
        body: (row: Order) =>
          row.profitMargin != null ? `${(Number(row.profitMargin) * 100).toFixed(1)}%` : '-',
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
          </Flex>
        ),
      },
    ],
    [navigate]
  );

  const handleSearch = (value: string) => {
    setQuery(value || undefined);
    setPage(1);
    const params: Record<string, string> = {};
    if (value) params.query = value;
    if (statusFilter) params.status = statusFilter;
    setSearchParams(params, { replace: true });
  };

  const selectStatus = (status?: string) => {
    setStatusFilter(status);
    setPage(1);
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (query) params.query = query;
    setSearchParams(params, { replace: true });
  };

  return {
    orders,
    totalRecords,
    pageSize,
    sortField,
    sortOrder,
    loading: isLoading,
    columns,
    handleSort,
    handlePageChange,
    handleSearch,
    statusFilter,
    setStatusFilter: selectStatus,
    searchValue,
    setSearchValue,
  };
};
