import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Table, Flex, StringInput, Select, Option } from '@baby-toys/ui-kit';
import { useOrdersPage } from './useOrdersPage.tsx';
import styles from './orders-page.module.scss';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
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
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>{t('orders.title')}</Heading>
          <Flex spacing="m">
            <Select
              value={statusFilter ?? ''}
              className={styles.orderPageStatus}
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
        </Flex>
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
