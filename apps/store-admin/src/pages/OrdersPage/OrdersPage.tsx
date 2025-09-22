import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Button,
  Heading,
  Table,
  Flex,
  Chip,
  ConfirmDialog,
  StringInput,
} from '@baby-toys/ui-kit/components';
import { useOrdersPage } from './useOrdersPage';
import styles from './orders-page.module.scss';
import { faEye, faPen, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const OrdersPage: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const {
    orders,
    totalRecords,
    pageSize,
    sortField,
    sortOrder,
    loading,
    columns,
    confirmVisible,
    orderToDelete,
    handleSort,
    handlePageChange,
    confirmDelete,
    cancelDelete,
    handleSearch,
  } = useOrdersPage();

  function renderCell(row: any, col: any) {
    switch (col.field) {
      case 'status':
        return <Chip label={row.status} appearance={col.body(row).color} />;

      case 'actions': {
        const { onDetails, onEdit, onDelete } = col.body(row);
        return (
          <Flex spacing="m">
            <Button size="small" appearance="outline" leftIcon={faEye} onClick={onDetails} />
            <Button size="small" leftIcon={faPen} appearance="outline" onClick={onEdit} />
            <Button size="small" appearance="outline" leftIcon={faTrashAlt} onClick={onDelete} />
          </Flex>
        );
      }

      default:
        return col.body ? col.body(row) : null;
    }
  }

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>Orders</Heading>
          <StringInput
            placeholder="Search by order number..."
            className={styles.orderPageSearch}
            value={searchValue}
            onChange={(val) => {
              const v = String(val ?? '');
              setSearchValue(v);
              if (!v.length) handleSearch('');
            }}
            iconRight={faSearch}
            withIconBackground
            onIconClick={() => handleSearch(searchValue)}
          />
        </Flex>
        <Table
          value={orders}
          columns={columns.map((col) => ({
            ...col,
            body: col.body ? (row: any) => renderCell(row, col) : undefined,
          }))}
          paginator
          rows={pageSize}
          totalRecords={totalRecords}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          isLoading={loading}
          onPageChange={handlePageChange}
        />
        <ConfirmDialog
          visible={confirmVisible}
          header="Delete Order"
          message={`Are you sure you want to delete order #${orderToDelete?.orderNumber || orderToDelete?.id}?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </Flex>
    </AdminLayout>
  );
};

export default OrdersPage;
