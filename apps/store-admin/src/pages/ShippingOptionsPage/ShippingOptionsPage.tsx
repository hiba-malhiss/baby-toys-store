import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Button, ConfirmDialog, Flex, Heading, Table } from '@baby-toys/ui-kit';
import { faPen, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
  useShippingOptions,
  useDeleteShippingOption,
  type ShippingOption,
} from '../../api/shippingOptionApi';
import ShippingOptionDialog from './ShippingOptionDialog';

const ROWS_PER_PAGE = 10;

const ShippingOptionsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editing, setEditing] = useState<ShippingOption | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<ShippingOption | null>(null);

  const { data, isLoading } = useShippingOptions({
    page,
    size: ROWS_PER_PAGE,
    sortBy,
    sortDirection,
  });
  const deleteMutation = useDeleteShippingOption();

  const rows = data?.content || [];

  const columns = [
    { header: 'Name', field: 'name', sortable: true },
    { header: 'Description', field: 'description' },
    { header: 'Cost', field: 'cost', sortable: true },
    { header: 'Language', field: 'locale', sortable: true },
    {
      header: 'Active',
      field: 'active',
      body: (row: ShippingOption) => (row.active ? 'Yes' : 'No'),
      sortable: true,
    },
    {
      header: 'Actions',
      field: 'actions',
      body: (row: ShippingOption) => (
        <Flex spacing="m">
          <Button
            size="small"
            leftIcon={faPen}
            appearance="outline"
            onClick={() => {
              setEditing(row);
              setDialogVisible(true);
            }}
          />
          <Button
            size="small"
            leftIcon={faTrashAlt}
            appearance="outline"
            onClick={() => {
              setToDelete(row);
              setConfirmOpen(true);
            }}
          />
        </Flex>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="xl" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading level="h1">Shipping Options</Heading>
          <Flex align="center" spacing="xl">
            <Button
              leftIcon={faPlus}
              onClick={() => {
                setEditing(null);
                setDialogVisible(true);
              }}
            >
              Add Shipping Option
            </Button>
          </Flex>
        </Flex>

        <Table
          columns={columns}
          value={rows}
          isLoading={isLoading}
          paginator
          rows={ROWS_PER_PAGE}
          totalRecords={data?.totalElements || 0}
          onPageChange={(ev: any) => setPage(ev.page + 1)}
          onSort={(ev: any) => {
            setSortBy(ev.sortField || 'id');
            setSortDirection(ev.sortOrder === 1 ? 'ASC' : 'DESC');
          }}
          sortField={sortBy}
          sortOrder={sortDirection === 'ASC' ? 1 : -1}
          emptyMessage="No shipping options found"
          stripedRows
        />

        <ShippingOptionDialog
          visible={dialogVisible}
          option={editing || undefined}
          onHide={() => setDialogVisible(false)}
          onSuccess={() => setDialogVisible(false)}
        />

        <ConfirmDialog
          visible={!!confirmOpen}
          header="Confirm Delete"
          message={`Are you sure you want to delete "${toDelete?.name}"?`}
          onConfirm={async () => {
            if (toDelete) {
              await deleteMutation.mutateAsync(toDelete.id);
            }
            setConfirmOpen(false);
            setToDelete(null);
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      </Flex>
    </AdminLayout>
  );
};

export default ShippingOptionsPage;
