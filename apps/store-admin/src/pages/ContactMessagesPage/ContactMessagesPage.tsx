import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Button,
  Chip,
  Flex,
  Heading,
  Select,
  Option,
  Table,
  useToast,
  Tooltip,
  PageHeader,
} from '@baby-toys/ui-kit';
import {
  useAdminContactMessages,
  useGetContactMessage,
  useUpdateContactStatus,
} from '../../api/contactApi';
import type { ContactMessage, ContactMessageStatus } from '../../api/types/contact';
import ContactMessageDialog from './ContactMessageDialog';

const STATUS_APPEARANCE: Record<string, 'warning' | 'secondary' | 'success'> = {
  NEW: 'warning',
  READ: 'secondary',
  REPLIED: 'success',
};

export default function ContactMessagesPage() {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<ContactMessageStatus | ''>('');
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const toast = useToast();

  const { data, isLoading } = useAdminContactMessages({ page, size: pageSize, status });
  const { data: selectedMessage, isLoading: isLoadingSelected } = useGetContactMessage(selectedId);
  const { mutate: updateStatus } = useUpdateContactStatus();

  const statusOptions = useMemo(
    () => [
      { label: t('app.all', { defaultValue: 'All' }), value: '' },
      { label: t('app.contact.status.new'), value: 'NEW' },
      { label: t('app.contact.status.read'), value: 'READ' },
      { label: t('app.contact.status.replied'), value: 'REPLIED' },
    ],
    [t]
  );

  const columns = useMemo(
    () => [
      { field: 'id', header: t('app.contact.fields.id') },
      { field: 'name', header: t('app.contact.fields.name') },
      { field: 'email', header: t('app.contact.fields.email') },
      { field: 'phoneNumber', header: t('app.contact.fields.phone') },
      { field: 'subject', header: t('app.contact.fields.subject') },
      {
        field: 'status',
        header: t('app.contact.fields.status'),
        body: (row: ContactMessage) => (
          <Chip
            label={t(`app.contact.status.${row.status.toLowerCase()}`, {
              defaultValue: row.status,
            })}
            appearance={STATUS_APPEARANCE[row.status] ?? 'secondary'}
          />
        ),
      },
      {
        field: 'actions',
        header: t('app.common.actions'),
        body: (row: ContactMessage) => (
          <Flex spacing="s">
            <Tooltip position="top" content={t('app.common.view')}>
              <Button
                size="small"
                appearance="outline"
                onClick={() => {
                  setSelectedId(row.id);
                  setDialogOpen(true);
                }}
              >
                {t('app.common.view')}
              </Button>
            </Tooltip>
            <Select
              value={row.status}
              onChange={(val) =>
                updateStatus(
                  { id: row.id, status: val as ContactMessageStatus },
                  {
                    onSuccess: () =>
                      toast.success(
                        t('app.contact.statusUpdated', { defaultValue: 'Status updated' })
                      ),
                    onError: () => toast.error(t('app.unexpectedError')),
                  }
                )
              }
            >
              {statusOptions
                .filter((o) => o.value)
                .map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
            </Select>
          </Flex>
        ),
      },
    ],
    [t, updateStatus, statusOptions, toast]
  );

  return (
    <AdminLayout>
      <PageHeader
        left={<Heading>{t('app.contact.title', { defaultValue: 'Contact Messages' })}</Heading>}
        right={
          <Select
            value={status}
            onChange={(val) => {
              setStatus(val as any);
              setPage(1);
            }}
          >
            {statusOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        }
      />

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
        emptyMessage={t('app.contact.empty', { defaultValue: 'No contact messages.' })}
      />

      <ContactMessageDialog
        visible={dialogOpen}
        onHide={() => {
          setDialogOpen(false);
          setSelectedId(undefined);
        }}
        message={selectedMessage}
        isLoading={isLoadingSelected}
      />
    </AdminLayout>
  );
}
