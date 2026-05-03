import React, { useMemo, useState, useCallback, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Heading,
  Table,
  Button,
  StringInput,
  Flex,
  CopyToClipboardButton,
  Tooltip,
  PageHeader,
} from '@baby-toys/ui-kit';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminUsers } from '../../api/usersApi';
import type { AdminUser } from '../../api/types/user';
import styles from './customer-page.module.scss';
import { Search, ShoppingCart, Star } from 'lucide-react';

const CustomersPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<-1 | 1>(-1);

  const initialQ = searchParams.get('query') || '';
  const [queryInput, setQueryInput] = useState<string>(initialQ);
  const [query, setQuery] = useState<string>(initialQ);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.query = query;
    setSearchParams(params, { replace: true });
  }, [query, setSearchParams]);

  useEffect(() => {
    if (!queryInput.trim() && query !== '') {
      setQuery('');
      setPage(1);
    }
  }, [queryInput, query]);

  const { data, isLoading } = useAdminUsers({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDirection: sortOrder === 1 ? 'ASC' : 'DESC',
    query,
  });

  const customers = useMemo(() => data?.content ?? [], [data]);
  const totalRecords = data?.totalElements ?? 0;

  const handleSort = useCallback(({ field, order }: { field: string; order: number }) => {
    setSortField(field);
    setSortOrder(order);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  const columns = useMemo(
    () => [
      {
        field: 'id',
        header: t('customers.columns.id'),
        body: (row: AdminUser) => (
          <Flex spacing="xs" align="center">
            <span>#{row.id}</span>
            <CopyToClipboardButton
              value={row.id}
              successMessage={t('customers.copy.userId')}
              ariaLabel={t('customers.ariaLabels.copyUserId')}
              appearance="link"
            />
          </Flex>
        ),
      },
      {
        field: 'email',
        header: t('customers.columns.email'),
        sortable: true,
        body: (row: AdminUser) => (
          <Flex spacing="xs" align="center">
            <span>{row.email}</span>
            <CopyToClipboardButton
              value={row.email}
              successMessage={t('customers.copy.email')}
              ariaLabel={t('customers.ariaLabels.copyEmail')}
              appearance="link"
            />
          </Flex>
        ),
      },
      {
        field: 'name',
        header: t('customers.columns.name'),
        body: (row: AdminUser) => `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim() || '-',
      },
      {
        field: 'phoneNumber',
        header: t('customers.columns.phone'),
        body: (row: AdminUser) => row.phoneNumber ?? '-',
      },
      {
        field: 'age',
        header: t('customers.columns.age'),
        body: (row: AdminUser) => (row.age ?? '-') as any,
      },
      {
        field: 'country',
        header: t('customers.columns.country'),
        body: (row: AdminUser) => row.country ?? '-',
      },
      {
        field: 'actions',
        header: t('customers.columns.actions'),
        body: (row: AdminUser) => (
          <Flex spacing="xs">
            <Tooltip position="top" content={t('customers.actions.viewOrders')}>
              <Button
                size="small"
                appearance="outline"
                leftIconComp={ShoppingCart}
                onClick={() => navigate(`/orders?query=${row.id}`)}
              />
            </Tooltip>
            <Tooltip position="top" content={t('customers.actions.viewReviews')}>
              <Button
                size="small"
                appearance="outline"
                leftIconComp={Star}
                onClick={() => navigate(`/reviews?userId=${row.id}`)}
              />
            </Tooltip>
          </Flex>
        ),
      },
    ],
    [navigate, t]
  );

  return (
    <AdminLayout>
      <PageHeader
        left={<Heading>{t('customers.pageTitle')}</Heading>}
        right={
          <StringInput
            className={styles.customersPageSearch}
            placeholder={t('customers.searchPlaceholder')}
            value={queryInput}
            onChange={(v) => setQueryInput(String(v ?? ''))}
            iconRight={Search}
            withIconBackground
            onIconClick={() => {
              setQuery(queryInput.trim());
              setPage(1);
            }}
          />
        }
      />

      <Table
        stripedRows
        value={customers}
        columns={columns}
        paginator
        rows={pageSize}
        totalRecords={totalRecords}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        emptyMessage={t('customers.empty', { defaultValue: 'No customers found.' })}
      />
    </AdminLayout>
  );
};

export default CustomersPage;
