import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Table, Flex, StringInput, Select, Option, PageHeader } from '@baby-toys/ui-kit';
import { useOrdersPage } from './useOrdersPage.tsx';
import styles from './orders-page.module.scss';
import { Search } from 'lucide-react';
import { getOrderStatusOptions } from './orders-page.utils';
import { useTranslation } from 'react-i18next';

const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
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
  const statusOptions = getOrderStatusOptions(t);

  return (
    <AdminLayout>
      <PageHeader
        left={<Heading>{t('orders.title')}</Heading>}
        right={
          <Flex spacing="s" align="center">
            <Select
              value={statusFilter ?? ''}
              className={styles.ordersPageStatus}
              onChange={(value) => setStatusFilter((value as string) || undefined)}
            >
              <Option value="">{t('app.all')}</Option>
              {statusOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
            <StringInput
              placeholder={t('orders.searchPlaceholder')}
              className={styles.ordersPageSearch}
              value={searchValue}
              onChange={(v) => {
                setSearchValue(v);
                if (!v?.trim() && searchValue) handleSearch('');
              }}
              iconRight={Search}
              withIconBackground
              onIconClick={() => handleSearch(searchValue.trim())}
            />
          </Flex>
        }
      />

      <Table
        stripedRows
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
    </AdminLayout>
  );
};

export default OrdersPage;
