import React, { useMemo, useState, useCallback, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Table, Button, StringInput, Flex, CopyToClipboardButton } from '@baby-toys/ui-kit';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminUsers } from '../../api/usersApi';
import type { AdminUser } from '../../api/types/user';
import styles from './customer-page.module.scss';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Table & query state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<-1 | 1>(-1);

  // Separate input vs applied filter
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
        header: 'ID',
        body: (row: AdminUser) => (
          <Flex spacing="s" align="center">
            <span>#{row.id}</span>
            <CopyToClipboardButton
              value={row.id}
              successMessage="User ID copied"
              ariaLabel="Copy user ID"
              appearance="link"
            />
          </Flex>
        ),
      },
      {
        field: 'email',
        header: 'Email',
        sortable: true,
        body: (row: AdminUser) => (
          <Flex spacing="s" align="center">
            <span>{row.email}</span>
            <CopyToClipboardButton
              value={row.email}
              successMessage="Email copied"
              ariaLabel="Copy email"
              appearance="link"
            />
          </Flex>
        ),
      },
      {
        field: 'name',
        header: 'Name',
        body: (row: AdminUser) => `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim() || '-',
      },
      {
        field: 'phoneNumber',
        header: 'Phone',
        body: (row: AdminUser) => row.phoneNumber ?? '-',
      },
      {
        field: 'age',
        header: 'Age',
        body: (row: AdminUser) => (row.age ?? '-') as any,
      },
      {
        field: 'country',
        header: 'Country',
        body: (row: AdminUser) => row.country ?? '-',
      },
      {
        field: 'actions',
        header: 'Actions',
        body: (row: AdminUser) => (
          <Flex spacing="s">
            <Button appearance="outline" onClick={() => navigate(`/orders?query=${row.id}`)}>
              View Orders
            </Button>
            <Button appearance="outline" onClick={() => navigate(`/reviews?userId=${row.id}`)}>
              View Reviews
            </Button>
          </Flex>
        ),
      },
    ],
    [navigate]
  );

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex align="center" justify="between" fullWidth>
          <Heading>Customers</Heading>
          <StringInput
            className={styles.customersPageSearch}
            placeholder="Search by name, email, or ID"
            value={queryInput}
            onChange={(v) => setQueryInput(String(v ?? ''))}
            fullWidth
            withIconBackground
            iconRight={faSearch}
            onIconClick={() => {
              setQuery(queryInput.trim());
              setPage(1);
            }}
          />
        </Flex>

        <Table
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
        />
      </Flex>
    </AdminLayout>
  );
};

export default CustomersPage;
