import React, { useMemo, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Button,
  Flex,
  Table,
  Heading,
  BouncingDotsLoader,
  Alert,
  ConfirmDialog,
  PageHeader,
  Chip,
  Tooltip,
} from '@baby-toys/ui-kit';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  useAdminTowns,
  useDeactivateTown,
  type AdminDeliveryTown,
} from '../../api/deliveryLocationsApi';
import DeliveryTownDialog from './DeliveryTownDialog';
import { useTranslation } from 'react-i18next';
import { getSupportedLocales } from '../../i18n/locale';

const DeliveryTownsPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: towns = [], isLoading, error } = useAdminTowns();
  const deactivateTown = useDeactivateTown();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editing, setEditing] = useState<AdminDeliveryTown | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toDeactivate, setToDeactivate] = useState<AdminDeliveryTown | null>(null);

  const isMutating = deactivateTown.isPending;

  const onEdit = (row: AdminDeliveryTown) => {
    setEditing(row);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setEditing(null);
  };

  const askDeactivate = (row: AdminDeliveryTown) => {
    setToDeactivate(row);
    setConfirmVisible(true);
  };

  const columns = useMemo(() => {
    const locales = getSupportedLocales();
    const localeCols = locales.map((loc) => ({
      header: `${t('delivery.columns.name')} (${loc})`,
      field: `name_${loc}`,
      body: (row: AdminDeliveryTown) =>
        (row.translations || []).find((tr) => (tr.locale || '').toLowerCase() === loc)
          ?.displayName || '',
    }));
    return [
      { header: t('delivery.columns.code'), field: 'code' },
      ...localeCols,
      { header: t('delivery.columns.zone'), field: 'zoneCode' },
      { header: t('delivery.columns.feeOverride'), field: 'feeOverride' },
      {
        header: t('delivery.columns.active'),
        field: 'active',
        body: (row: AdminDeliveryTown) => (
          <Chip
            label={row.active ? t('app.yes') : t('app.no')}
            appearance={row.active ? 'success' : 'secondary'}
          />
        ),
      },
      {
        header: t('app.actions'),
        field: 'actions',
        body: (row: AdminDeliveryTown) => (
          <Flex spacing="s">
            <Tooltip position="top" content={t('common.edit')}>
              <Button
                size="small"
                appearance="outline"
                leftIconComp={Pencil}
                onClick={() => onEdit(row)}
                aria-label={t('common.edit')}
              />
            </Tooltip>
            <Tooltip
              position="top"
              content={t('delivery.deactivate', { defaultValue: 'Deactivate' })}
            >
              <Button
                size="small"
                appearance="outline"
                leftIconComp={Trash2}
                isDisabled={!row.active || isMutating}
                onClick={() => askDeactivate(row)}
                aria-label={t('delivery.deactivate', { defaultValue: 'Deactivate' })}
              />
            </Tooltip>
          </Flex>
        ),
      },
    ];
  }, [t, isMutating]);

  if (isLoading) {
    return (
      <AdminLayout>
        <BouncingDotsLoader />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Alert
          appearance="error"
          title={t('delivery.loadErrorTitle', { defaultValue: 'Error loading towns' })}
          message={(error as any).message || t('app.unexpectedError')}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        left={<Heading>{t('delivery.towns.title', { defaultValue: 'Delivery Towns' })}</Heading>}
        right={
          <Button leftIconComp={Plus} onClick={() => setDialogVisible(true)}>
            {t('delivery.addTown', { defaultValue: 'Add Town' })}
          </Button>
        }
      />

      <Table
        stripedRows
        value={towns}
        columns={columns}
        emptyMessage={t('delivery.towns.empty', { defaultValue: 'No delivery towns found.' })}
      />

      <DeliveryTownDialog visible={dialogVisible} onHide={closeDialog} town={editing} />

      <ConfirmDialog
        visible={confirmVisible}
        header={t('delivery.deactivateTitle', { defaultValue: 'Deactivate Town' })}
        message={t('delivery.deactivateTownConfirm', {
          defaultValue: 'Deactivate town "{{code}}"?',
          code: toDeactivate?.code,
        })}
        onConfirm={async () => {
          if (toDeactivate) {
            await deactivateTown.mutateAsync(toDeactivate.code);
          }
          setConfirmVisible(false);
          setToDeactivate(null);
        }}
        onCancel={() => {
          setConfirmVisible(false);
          setToDeactivate(null);
        }}
        confirmLabel={t('delivery.deactivate', { defaultValue: 'Deactivate' })}
        cancelLabel={t('common.cancel')}
      />
    </AdminLayout>
  );
};

export default DeliveryTownsPage;
