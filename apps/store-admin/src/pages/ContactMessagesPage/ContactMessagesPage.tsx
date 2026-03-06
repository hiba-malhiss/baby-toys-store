import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Button, Chip, Flex, Heading, Select, Table, useToast, Tooltip } from '@baby-toys/ui-kit';
import {
  useAdminContactMessages,
  useGetContactMessage,
  useUpdateContactStatus,
} from '../../api/contactApi';
import type { ContactMessage, ContactMessageStatus } from '../../api/types/contact';
import ContactMessageDialog from './ContactMessageDialog';

const STATUS_OPTIONS = (t: any) => [
  { label: t('app.contact.status.new'), value: 'NEW' },
  { label: t('app.contact.status.read'), value: 'READ' },
  { label: t('app.contact.status.replied'), value: 'REPLIED' },
];

export default function ContactMessagesPage() {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<ContactMessageStatus | ''>('');
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const toast = useToast();

  const statusOptions = useMemo(() => STATUS_OPTIONS(t), [t]);

  const { data, isLoading } = useAdminContactMessages({ page, size: pageSize, status });
  const { data: selectedMessage, isLoading: isLoadingSelected } = useGetContactMessage(selectedId);
  const { mutate: updateStatus } = useUpdateContactStatus();

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
            label={row.status}
            appearance={
              row.status === 'NEW' ? 'warning' : row.status === 'READ' ? 'secondary' : 'success'
            }
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
              options={statusOptions as any}
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
          <Heading>{t('app.contact.title')}</Heading>
          <Flex spacing="m" align="center">
            <Select
              options={[{ label: t('app.common.all'), value: '' }, ...statusOptions] as any}
              value={status}
              onChange={(val) => {
                setStatus(val as ContactMessageStatus | '');
                setPage(1);
              }}
              placeholder={t('app.contact.filterByStatus')}
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
