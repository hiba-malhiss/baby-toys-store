import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Table, Flex, StringInput, Select, Option } from '@baby-toys/ui-kit';
import { useOrdersPage } from './useOrdersPage.tsx';
import styles from './orders-page.module.scss';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { orderStatusOptions } from './orders-page.utils';

const OrdersPage: React.FC = () => {
  const {
    orders,
    totalRecords,
    pageSize,
    sortField,
    sortOrder,
    loading,
    columns,
    handleSort,
    handlePageChange,
    handleSearch,
    statusFilter,
    setStatusFilter,
    searchValue,
    setSearchValue,
  } = useOrdersPage();

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>Orders</Heading>
          <StringInput
            placeholder="Search by order number or user ID..."
            className={styles.orderPageSearch}
            fullWidth
            value={searchValue}
            onChange={(v) => {
              setSearchValue(v);
              if (!v?.trim() && searchValue) handleSearch('');
            }}
            iconRight={faSearch}
            withIconBackground
            onIconClick={() => handleSearch(searchValue.trim())}
          />
        </Flex>

        <Select
          value={statusFilter ?? ''}
          className={styles.orderPageSearch}
          onChange={(value) => setStatusFilter((value as string) || undefined)}
        >
          <Option value="">All</Option>
          {orderStatusOptions.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>

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
      </Flex>
    </AdminLayout>
  );
};

export default OrdersPage;
