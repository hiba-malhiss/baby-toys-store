import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Button, Select, Option, Card, Table } from '@baby-toys/ui-kit/components';
import { useOrdersData } from './useOrdersData';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, loading, totalRecords, page, pageSize, sortField, sortOrder, setPage, setPageSize, setSortField, setSortOrder, setFilters, handleStatusChange } = useOrdersData();

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
