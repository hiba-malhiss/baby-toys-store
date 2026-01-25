import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Table, Flex, StringInput, Chip, Button } from '@baby-toys/ui-kit';
import styles from './admin-audit-logs-page.module.scss';
import { faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuditLogs } from '../../api/auditApi';
import { useTranslation } from 'react-i18next';
import AdminAuditDetailDialog from './AdminAuditDetailDialog/AdminAuditDetailDialog';

const AdminAuditLogsPage: React.FC = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1); // 1-based
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
    { header: t('auditLogs.timestamp', { defaultValue: 'Timestamp' }), field: 'timestamp' },
    { header: t('auditLogs.action', { defaultValue: 'Action' }), field: 'action' },
    { header: t('auditLogs.entity', { defaultValue: 'Entity' }), field: 'entity' },
    { header: t('auditLogs.entityId', { defaultValue: 'Entity ID' }), field: 'entityId' },
    { header: t('auditLogs.adminUserId', { defaultValue: 'Admin User' }), field: 'adminUserId' },
    {
      header: t('auditLogs.status', { defaultValue: 'Status' }),
      field: 'success',
      body: (r: any) => (
        <Chip
          label={r.success ? t('common.success', { defaultValue: 'Success' }) : t('common.failed', { defaultValue: 'Failed' })}
          appearance={r.success ? 'success' : 'warning'}
        />
      ),
    },
    { header: t('auditLogs.error', { defaultValue: 'Error' }), field: 'errorMessage' },
    { header: t('auditLogs.path', { defaultValue: 'Path' }), field: 'path' },
    { header: t('auditLogs.ip', { defaultValue: 'IP' }), field: 'ip' },
    {
      header: t('auditLogs.action', { defaultValue: 'Action' }),
      field: 'id',
      body: (r: any) => (
        <Button
          size="small"
          appearance="outline"
          leftIcon={faEye}
          onClick={() => {
            setDetailId(r.id);
            setDetailOpen(true);
          }}
        >
        </Button>
      ),
    },
  ];

  const handlePageChange = (ev: { page: number; rows: number }) => {
    setPage(ev.page + 1); // Table passes 0-based
    setRows(ev.rows);
  };

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>{t('auditLogs.title', { defaultValue: 'Audit Logs' })}</Heading>
          <Flex spacing="s" align="center" className={styles.toolbar}>
            <StringInput
              placeholder={t('auditLogs.searchByEntityId', { defaultValue: 'Search by Entity ID' })}
              className={styles.search}
              fullWidth
              value={entityIdInput}
              onChange={(v) => {
                setEntityIdInput(v);
                if(!v.trim()) {
                  setPage(1);
                  setEntityIdFilter(undefined);
                  refetch();
                }
              }}
              iconRight={faSearch}
              withIconBackground
              onIconClick={() => {
                setPage(1);
                setEntityIdFilter(entityIdInput.trim() || undefined);
              }}
            />
            <Button appearance="outline" isLoading={isFetching} onClick={() => refetch()}>
              {t('app.refresh', { defaultValue: 'Refresh' })}
            </Button>
          </Flex>
        </Flex>

        <Table
          stripedRows
          value={logs}
          columns={columns as any}
          paginator
          rows={rows}
          totalRecords={totalRecords}
          sortField={'timestamp'}
          sortOrder={-1}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
        <AdminAuditDetailDialog open={detailOpen} logId={detailId} onClose={() => setDetailOpen(false)}/>
      </Flex>
    </AdminLayout>
  );
};

export default AdminAuditLogsPage;
