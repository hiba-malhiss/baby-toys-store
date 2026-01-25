import { useState, useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Button, Chip, Flex, Heading, Select, Table, useToast } from '@baby-toys/ui-kit';
import {
  useAdminContactMessages,
  useGetContactMessage,
  useUpdateContactStatus,
} from '../../api/contactApi';
import type { ContactMessage, ContactMessageStatus } from '../../api/types/contact';
import ContactMessageDialog from './ContactMessageDialog';

const STATUS_OPTIONS = [
  { label: 'New', value: 'NEW' },
  { label: 'Read', value: 'READ' },
  { label: 'Replied', value: 'REPLIED' },
];

export default function ContactMessagesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<ContactMessageStatus | ''>('');
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const toast = useToast();

  const { data, isLoading } = useAdminContactMessages({ page, size: pageSize, status });
  const { data: selectedMessage, isLoading: isLoadingSelected } = useGetContactMessage(selectedId);
  const { mutate: updateStatus } = useUpdateContactStatus();

  const columns = useMemo(
    () => [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'phoneNumber', header: 'Phone' },
      { field: 'subject', header: 'Subject' },
      {
        field: 'status',
        header: 'Status',
        body: (row: ContactMessage) => (
          <Chip
            label={row.status}
            appearance={
              row.status === 'NEW' ? 'warning' : row.status === 'READ' ? 'secondary' : 'success'
            }
          />
        ),
      },
      {
        field: 'actions',
        header: 'Actions',
        body: (row: ContactMessage) => (
          <Flex spacing="s">
            <Button
              appearance="outline"
              onClick={() => {
                setSelectedId(row.id);
                setDialogOpen(true);
              }}
            >
              View
            </Button>
            <Select
              options={STATUS_OPTIONS as any}
              value={row.status}
              onChange={(val) => updateStatus({ id: row.id, status: val as ContactMessageStatus })}
            />
          </Flex>
        ),
      },
    ],
    [toast, updateStatus]
  );

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>Contact Messages</Heading>
          <Flex spacing="m" align="center">
            <Select
              options={[{ label: 'All', value: '' }, ...STATUS_OPTIONS] as any}
              value={status}
              onChange={(val) => {
                setStatus(val as ContactMessageStatus | '');
                setPage(1);
              }}
              placeholder="Filter by status"
            />
          </Flex>
        </Flex>

        <Table
          stripedRows
          value={data?.content ?? []}
          columns={columns}
          paginator
          rows={pageSize}
          totalRecords={data?.totalElements ?? 0}
          onPageChange={(newPage, newSize) => {
            setPage(newPage);
            setPageSize(newSize);
          }}
          isLoading={isLoading}
        />
      </Flex>

      <ContactMessageDialog
        visible={dialogOpen}
        onHide={() => setDialogOpen(false)}
        message={selectedMessage}
        isLoading={isLoadingSelected}
      />
    </AdminLayout>
  );
}
