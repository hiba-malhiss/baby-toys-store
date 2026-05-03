import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Heading,
  Table,
  Flex,
  StringInput,
  Chip,
  Button,
  PageHeader,
  Tooltip,
  formatDateTime,
} from '@baby-toys/ui-kit';
import styles from './admin-audit-logs-page.module.scss';
import { Eye, Search, RefreshCw } from 'lucide-react';
import { useAdminAuditLogs } from '../../api/auditApi';
import { useTranslation } from 'react-i18next';
import AdminAuditDetailDialog from './AdminAuditDetailDialog/AdminAuditDetailDialog';

const AdminAuditLogsPage: React.FC = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(20);

  const [entityIdInput, setEntityIdInput] = useState('');
  const [entityIdFilter, setEntityIdFilter] = useState<string | undefined>(undefined);

  const { data, isLoading, isFetching, refetch } = useAdminAuditLogs({
    page,
    size: rows,
    sortBy: 'timestamp',
    sortDirection: 'DESC',
    entityId: entityIdFilter,
  });

  const totalRecords = data?.totalElements ?? 0;
  const logs = data?.content ?? [];

  const [detailId, setDetailId] = useState<number | undefined>(undefined);
  const [detailOpen, setDetailOpen] = useState(false);

  const columns = [
    {
      header: t('auditLogs.timestamp', { defaultValue: 'Timestamp' }),
      field: 'timestamp',
      body: (r: any) => formatDateTime(r.timestamp),
    },
    { header: t('auditLogs.action', { defaultValue: 'Action' }), field: 'action' },
    { header: t('auditLogs.entity', { defaultValue: 'Entity' }), field: 'entity' },
    { header: t('auditLogs.entityId', { defaultValue: 'Entity ID' }), field: 'entityId' },
    { header: t('auditLogs.adminUserId', { defaultValue: 'Admin User' }), field: 'adminUserId' },
    {
      header: t('auditLogs.status', { defaultValue: 'Status' }),
      field: 'success',
      body: (r: any) => (
        <Chip
          label={
            r.success
              ? t('common.success', { defaultValue: 'Success' })
              : t('common.failed', { defaultValue: 'Failed' })
          }
          appearance={r.success ? 'success' : 'error'}
        />
      ),
    },
    { header: t('auditLogs.error', { defaultValue: 'Error' }), field: 'errorMessage' },
    { header: t('auditLogs.path', { defaultValue: 'Path' }), field: 'path' },
    { header: t('auditLogs.ip', { defaultValue: 'IP' }), field: 'ip' },
    {
      header: t('app.actions'),
      field: 'id',
      body: (r: any) => (
        <Tooltip
          position="top"
          content={t('auditLogs.viewDetail', { defaultValue: 'View detail' })}
        >
          <Button
            size="small"
            appearance="outline"
            leftIconComp={Eye}
            onClick={() => {
              setDetailId(r.id);
              setDetailOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const handlePageChange = (ev: { page: number; rows: number }) => {
    setPage(ev.page + 1); // Table passes 0-based
    setRows(ev.rows);
  };

  return (
    <AdminLayout>
      <PageHeader
        left={<Heading>{t('auditLogs.title', { defaultValue: 'Audit Logs' })}</Heading>}
        right={
          <Flex spacing="s" align="center">
            <StringInput
              className={styles.auditSearch}
              placeholder={t('auditLogs.filterByEntityId', { defaultValue: 'Filter by Entity ID' })}
              value={entityIdInput}
              onChange={(v) => {
                setEntityIdInput(v);
                if (!v.trim()) {
                  setPage(1);
                  setEntityIdFilter(undefined);
                  refetch();
                }
              }}
              iconRight={Search}
              withIconBackground
              onIconClick={() => {
                setEntityIdFilter(entityIdInput.trim() || undefined);
                setPage(1);
              }}
            />
            <Tooltip position="top" content={t('common.refresh', { defaultValue: 'Refresh' })}>
              <Button
                appearance="outline"
                leftIconComp={RefreshCw}
                isLoading={isFetching}
                isDisabled={isFetching}
                onClick={() => refetch()}
              />
            </Tooltip>
          </Flex>
        }
      />

      <Table
        stripedRows
        value={logs}
        columns={columns}
        paginator
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        emptyMessage={t('auditLogs.empty', { defaultValue: 'No audit logs found.' })}
      />

      <AdminAuditDetailDialog
        logId={detailId}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailId(undefined);
        }}
      />
    </AdminLayout>
  );
};

export default AdminAuditLogsPage;
