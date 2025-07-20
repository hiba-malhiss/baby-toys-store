import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Button,
  Select,
  Option,
  Heading,
  Table,
  StringInput,
  Flex,
  Chip,
} from '@baby-toys/ui-kit/components';
import { useOrdersData } from './useOrdersData';
import { OrderItem } from '@baby-toys/types/src';
import { orderStatusOptions, statusColorMap } from './orders-page.utils.ts';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const tableRef = useRef<any>(null);
  const {
    orders,
    loading,
    totalRecords,
    pageSize,
    sortField,
    sortOrder,
    filters,
    setPage,
    setPageSize,
    setSortField,
    setSortOrder,
    setFilters,
  } = useOrdersData();

  // Columns definition for Table component
  const columns = [
    { field: 'id', header: 'Order ID', sortable: true },
    { field: 'email', header: 'Customer (Email / Phone)', sortable: true },
    {
      field: 'date',
      header: 'Date',
      sortable: true,
      body: (row: OrderItem) => new Date(row.date).toLocaleDateString(),
    },
    { field: 'total', header: 'Total', sortable: true },
    {
      field: 'shippingInfo.town',
      header: 'City',
      sortable: true,
      body: (row: OrderItem) => row.shippingInfo?.town,
    },
    {
      field: 'shippingInfo.country',
      header: 'Country',
      sortable: true,
      body: (row: OrderItem) => row.shippingInfo?.country,
    },
    {
      field: 'status',
      header: 'Status',
      body: (row: OrderItem) => <Chip label={row.status} color={statusColorMap[row.status]} />,
    },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: any) => (
        <Flex spacing="m">
          <Button appearance="outline" onClick={() => navigate(`/order-details/${row.id}`)}>
            Details
          </Button>
          <Button appearance="outline" onClick={() => navigate(`/order-edit/${row.id}`)}>
            Edit
          </Button>
        </Flex>
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

  const onFilter = (field: string, value: any, resetPagination = false) => {
    if (tableRef.current && resetPagination) {
      tableRef.current.resetPagination();
    }
    setFilters({ ...filters, [field]: value });
  };

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="xxl" fullWidth>
        <Flex justify="between" fullWidth>
          <Heading>Orders</Heading>
          <Flex spacing="xl">
            <Select
              placeholder="Filter by status"
              onChange={(value) => onFilter('status', value, true)}
              style={{ marginRight: '1rem' }}
            >
              {orderStatusOptions.map(({ label, value }) => (
                <Option key={value || 'all'} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
            <StringInput
              placeholder="Search by customer email/phone"
              onInput={(e) => onFilter('email', (e.target as HTMLInputElement).value, true)}
              style={{ width: '250px', marginRight: '1rem' }}
            />
            <StringInput
              placeholder="Search by city"
              onInput={(e) => onFilter('city', (e.target as HTMLInputElement).value, true)}
              style={{ width: '250px' }}
            />
            <Button appearance="outline" onClick={() => {}}>
              Search
            </Button>
          </Flex>
        </Flex>
        <Table
          ref={tableRef}
          value={orders}
          columns={columns}
          paginator
          rows={pageSize}
          totalRecords={totalRecords}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          isLoading={loading}
          onPageChange={handlePageChange}
        />
      </Flex>
    </AdminLayout>
  );
};

export default OrdersPage;
