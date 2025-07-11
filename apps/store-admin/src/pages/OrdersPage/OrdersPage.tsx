import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { getOrders, updateOrderStatus } from '@mock-data/useMockAdminApi.ts';
import { apiClient } from '../../api/apiClient';
import { Button, Select, Option, Card, Table } from '@baby-toys/ui-kit/components';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  // Table control state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState(1);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

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
      const response = await apiClient.get(getOrders, { params });
      setOrders(response.items);
      setTotalRecords(response.totalRecords);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortField, sortOrder, filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle order status update, then refresh list
  const handleStatusChange = (orderId: number, status: string) => {
    apiClient.put(updateOrderStatus, orderId, status).then(() => {
      fetchOrders();
    });
  };

  // Columns definition for Table component
  const columns = [
    { field: 'id', header: 'Order ID', sortable: true },
    { field: 'email', header: 'Customer', sortable: true, filter: true },
    {
      field: 'date',
      header: 'Date',
      sortable: true,
      body: (row: any) => new Date(row.date).toLocaleDateString(),
    },
    { field: 'total', header: 'Total', sortable: true },
    {
      field: 'status',
      header: 'Status',
      body: (row: any) => (
        <Select
          value={row.status}
          onChange={(value) => handleStatusChange(row.id, value as string)}
        >
          <Option value="pending">Pending</Option>
          <Option value="processing">Processing</Option>
          <Option value="shipped">Shipped</Option>
          <Option value="delivered">Delivered</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      ),
    },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: any) => (
        <Button onClick={() => navigate(`/order-details/${row.id}`)}>Details</Button>
      ),
    },
  ];

  // Table event handlers
  const handleSort = ({ field, order }: { field: string; order: number }) => {
    setSortField(field);
    setSortOrder(order);
    setPage(1);
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleFilterChange = (newFilters: { [key: string]: { value: string } }) => {
    const flatFilters = Object.fromEntries(
      Object.entries(newFilters).map(([k, v]) => [k, v.value])
    );
    setFilters(flatFilters);
    setPage(1);
  };

  return (
    <AdminLayout>
      <h1>Orders</h1>
      <Card>
        <Table
          value={orders}
          columns={columns}
          paginator
          rows={pageSize}
          totalRecords={totalRecords}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          loading={loading}
          scrollable
          scrollHeight={400}
          onSelectionChange={() => {}}
          selectionMode={null}
          rowHover
          stripedRows
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
        />
      </Card>
    </AdminLayout>
  );
};

export default OrdersPage;
