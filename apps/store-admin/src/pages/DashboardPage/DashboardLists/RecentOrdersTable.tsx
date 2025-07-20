import React from 'react';
import { Table } from '@baby-toys/ui-kit/components';
import { OrderItem } from '@baby-toys/types/src';

type RecentOrdersTableProps = {
  recentOrders: OrderItem[];
  isLoading?: boolean;
};

const recentOrdersColumns = [
  { field: 'id', header: 'Order ID' },
  { field: 'email', header: 'Customer' },
  { field: 'status', header: 'Status' },
];

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  recentOrders,
  isLoading = false,
}) => {
  return (
    <Table
      title="Recent Orders"
      value={recentOrders}
      columns={recentOrdersColumns}
      paginator={true}
      rows={5}
      totalRecords={recentOrders.length}
      sortField="id"
      sortOrder={1}
      onSort={({ field, order }) => {
        // Optional: handle sort externally if needed
        console.log('Sorted:', field, order);
      }}
      stripedRows={true}
      rowHover={true}
      isLoading={isLoading}
    />
  );
};

export default RecentOrdersTable;
