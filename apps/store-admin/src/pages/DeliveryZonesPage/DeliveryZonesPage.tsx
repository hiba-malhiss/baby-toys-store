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
  useAdminZones,
  useDeactivateZone,
  type AdminDeliveryZone,
} from '../../api/deliveryLocationsApi';
import DeliveryZoneDialog from './DeliveryZoneDialog';
import { useTranslation } from 'react-i18next';
import { getSupportedLocales } from '../../i18n/locale';

const DeliveryZonesPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: zones = [], isLoading, error } = useAdminZones();
  const deactivateZone = useDeactivateZone();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editing, setEditing] = useState<AdminDeliveryZone | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toDeactivate, setToDeactivate] = useState<AdminDeliveryZone | null>(null);

  const isMutating = deactivateZone.isPending;

  const onEdit = (row: AdminDeliveryZone) => {
    setEditing(row);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setEditing(null);
  };

  const askDeactivate = (row: AdminDeliveryZone) => {
    setToDeactivate(row);
    setConfirmVisible(true);
  };

  const columns = useMemo(() => {
    const locales = getSupportedLocales();
    const localeCols = locales.map((loc) => ({
      header: `${t('delivery.columns.name')} (${loc})`,
      field: `name_${loc}`,
      body: (row: AdminDeliveryZone) =>
        (row.translations || []).find((tr) => (tr.locale || '').toLowerCase() === loc)
          ?.displayName || '',
    }));
    return [
      { header: t('delivery.columns.code'), field: 'code' },
      ...localeCols,
      { header: t('delivery.columns.defaultFee'), field: 'defaultFee' },
      {
        header: t('delivery.columns.active'),
        field: 'active',
        body: (row: AdminDeliveryZone) => (
          <Chip
            label={row.active ? t('app.yes') : t('app.no')}
            appearance={row.active ? 'success' : 'secondary'}
          />
        ),
      },
      {
        header: t('app.actions'),
        field: 'actions',
        body: (row: AdminDeliveryZone) => (
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
          title={t('delivery.loadErrorTitle', { defaultValue: 'Error loading zones' })}
          message={(error as any).message || t('app.unexpectedError')}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        left={<Heading>{t('delivery.zones.title', { defaultValue: 'Delivery Zones' })}</Heading>}
        right={
          <Button leftIconComp={Plus} onClick={() => setDialogVisible(true)}>
            {t('delivery.addZone', { defaultValue: 'Add Zone' })}
          </Button>
        }
      />

      <Table
        stripedRows
        value={zones}
        columns={columns}
        emptyMessage={t('delivery.zones.empty', { defaultValue: 'No delivery zones found.' })}
      />

      <DeliveryZoneDialog visible={dialogVisible} onHide={closeDialog} zone={editing} />

      <ConfirmDialog
        visible={confirmVisible}
        header={t('delivery.deactivateTitle', { defaultValue: 'Deactivate Zone' })}
        message={t('delivery.deactivateConfirm', {
          defaultValue: 'Deactivate zone "{{code}}"?',
          code: toDeactivate?.code,
        })}
        onConfirm={async () => {
          if (toDeactivate) {
            await deactivateZone.mutateAsync(toDeactivate.code);
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

export default DeliveryZonesPage;
