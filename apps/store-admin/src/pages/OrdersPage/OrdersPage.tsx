import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Heading,
  Table,
  Flex,
  ConfirmDialog,
  StringInput,
  RadioButtonGroup,
} from '@baby-toys/ui-kit/components';
import { useOrdersPage } from './useOrdersPage.tsx';
import styles from './orders-page.module.scss';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { orderStatusOptions } from './orders-page.utils';

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
    statusFilter,
    setStatusFilter,
  } = useOrdersPage();

  // Debounced search on typing
  React.useEffect(() => {
    const id = setTimeout(() => {
      if (searchValue && searchValue.trim().length > 0) {
        handleSearch(searchValue.trim());
      }
    }, 300);
    return () => clearTimeout(id);
  }, [searchValue, handleSearch]);

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>Orders</Heading>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchValue.trim());
            }}
          >
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
              onIconClick={() => handleSearch(searchValue.trim())}
            />
          </form>
        </Flex>

        <RadioButtonGroup
          name="orders-status-filter"
          options={[{ label: 'All', value: '' }, ...orderStatusOptions] as any}
          selectedValue={statusFilter ?? ''}
          onChange={(value) => setStatusFilter(value || undefined)}
          spacing="m"
          appearance="chip"
        />
        <Table
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
