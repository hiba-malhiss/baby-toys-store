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
    pendingFilters,
    setPage,
    setPageSize,
    setSortField,
    setSortOrder,
    setFilters,
    setPendingFilters,
  } = useOrdersData();

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

  const handleSort = ({ field, order }: { field: string; order: number }) => {
    setSortField(field);
    setSortOrder(order);
    setPage(1);
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" fullWidth>
          <Heading>Orders</Heading>
          <Flex spacing="xl">
            <Select
              placeholder="Filter by status"
              value={pendingFilters.status || ''}
              onChange={(value) => setPendingFilters({ ...pendingFilters, status: value })}
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
              value={pendingFilters.email || ''}
              onInput={(e) =>
                setPendingFilters({
                  ...pendingFilters,
                  email: (e.target as HTMLInputElement).value,
                })
              }
              style={{ width: '250px', marginRight: '1rem' }}
            />

            <StringInput
              placeholder="Search by city"
              value={pendingFilters.city || ''}
              onInput={(e) =>
                setPendingFilters({
                  ...pendingFilters,
                  city: (e.target as HTMLInputElement).value,
                })
              }
              style={{ width: '250px' }}
            />

            <Button
              appearance="outline"
              onClick={() => {
                setFilters({ ...pendingFilters });
                setPage(1);
              }}
            >
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
