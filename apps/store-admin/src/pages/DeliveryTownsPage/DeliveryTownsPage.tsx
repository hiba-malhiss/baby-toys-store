import React, { useMemo, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Button, Flex, Table, Heading, BouncingDotsLoader, Alert, ConfirmDialog } from '@baby-toys/ui-kit';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useAdminTowns, useDeactivateTown, type AdminDeliveryTown } from '../../api/deliveryLocationsApi';
import DeliveryTownDialog from './DeliveryTownDialog';
import { useTranslation } from 'react-i18next';

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

  const columns = useMemo(
    () => [
      { header: t('delivery.columns.code'), field: 'code' },
      { header: t('delivery.columns.nameEn'), field: 'nameEn' },
      { header: t('delivery.columns.nameAr'), field: 'nameAr' },
      { header: t('delivery.columns.zone'), field: 'zoneCode' },
      { header: t('delivery.columns.feeOverride'), field: 'feeOverride' },
      {
        header: t('delivery.columns.active'),
        field: 'active',
        body: (row: AdminDeliveryTown) => (row.active ? t('common.yes') : t('common.no')),
      },
      {
        header: t('app.actions'),
        field: 'actions',
        body: (row: AdminDeliveryTown) => (
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
    await deactivateTown.mutateAsync({ id: toDeactivate.id });
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
    const msg = error?.message || t('delivery.towns.loadError');
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
          <Heading>{t('delivery.towns.title')}</Heading>
          <Button leftIconComp={Plus} onClick={() => { setEditing(null); setDialogVisible(true); }}>
            {t('delivery.towns.add')}
          </Button>
        </Flex>

        <Table columns={columns as any} value={towns} stripedRows emptyMessage={t('delivery.towns.empty')} />
      </Flex>

      <DeliveryTownDialog
        visible={dialogVisible}
        town={editing || undefined}
        onHide={closeDialog}
        onSuccess={closeDialog}
      />

      <ConfirmDialog
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={doDeactivate}
        header={t('delivery.towns.deactivateTitle')}
        message={toDeactivate ? t('delivery.towns.deactivateConfirm', { name: toDeactivate.nameEn, code: toDeactivate.code }) : ''}
      />
    </AdminLayout>
  );
};

export default DeliveryTownsPage;
