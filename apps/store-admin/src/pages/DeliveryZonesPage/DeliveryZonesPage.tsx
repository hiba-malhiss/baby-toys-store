import React, { useMemo, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Button, Flex, Table, Heading, BouncingDotsLoader, Alert, ConfirmDialog } from '@baby-toys/ui-kit';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useAdminZones, useDeactivateZone, type AdminDeliveryZone } from '../../api/deliveryLocationsApi';
import DeliveryZoneDialog from './DeliveryZoneDialog';
import { useTranslation } from 'react-i18next';

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

  const columns = useMemo(
    () => [
      { header: t('delivery.columns.code'), field: 'code' },
      { header: t('delivery.columns.nameEn'), field: 'nameEn' },
      { header: t('delivery.columns.nameAr'), field: 'nameAr' },
      { header: t('delivery.columns.defaultFee'), field: 'defaultFee' },
      {
        header: t('delivery.columns.active'),
        field: 'active',
        body: (row: AdminDeliveryZone) => (row.active ? t('common.yes') : t('common.no')),
      },
      {
        header: t('app.actions'),
        field: 'actions',
        body: (row: AdminDeliveryZone) => (
          <Flex spacing="m">
            <Button
              size="small"
              appearance="outline"
              leftIconComp={Pencil}
              onClick={() => onEdit(row)}
              aria-label={t('common.edit')}
            />
            <Button
              size="small"
              appearance="outline"
              leftIconComp={Trash2}
              onClick={() => askDeactivate(row)}
              aria-label={t('common.deactivate')}
            />
          </Flex>
        ),
      },
    ],
    [t]
  );

  const doDeactivate = async () => {
    if (!toDeactivate) return;
    await deactivateZone.mutateAsync({ id: toDeactivate.id });
    setConfirmVisible(false);
    setToDeactivate(null);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Flex justify="center"><BouncingDotsLoader /></Flex>
      </AdminLayout>
    );
  }

  if (error) {
    // @ts-ignore
    const msg = error?.message || t('delivery.zones.loadError');
    return (
      <AdminLayout>
        <Alert appearance="error" title={t('app.error')} message={msg} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout isMaskLoading={isMutating}>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>{t('delivery.zones.title')}</Heading>
          <Button leftIconComp={Plus} onClick={() => { setEditing(null); setDialogVisible(true); }}>
            {t('delivery.zones.add')}
          </Button>
        </Flex>

        <Table columns={columns as any} value={zones} stripedRows emptyMessage={t('delivery.zones.empty')} />
      </Flex>

      <DeliveryZoneDialog
        visible={dialogVisible}
        zone={editing || undefined}
        onHide={closeDialog}
        onSuccess={closeDialog}
      />

      <ConfirmDialog
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={doDeactivate}
        header={t('delivery.zones.deactivateTitle')}
        message={toDeactivate ? t('delivery.zones.deactivateConfirm', { name: toDeactivate.nameEn, code: toDeactivate.code }) : ''}
      />
    </AdminLayout>
  );
};

export default DeliveryZonesPage;
