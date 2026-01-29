import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, Button, Flex, FieldWrapper, StringInput, Checkbox, Select } from '@baby-toys/ui-kit';
import type { AdminDeliveryTown } from '../../api/deliveryLocationsApi';
import { useCreateTown, useUpdateTown, useAdminZones } from '../../api/deliveryLocationsApi';
import { useTranslation } from 'react-i18next';

export interface DeliveryTownDialogProps {
  visible: boolean;
  town?: AdminDeliveryTown;
  onHide: () => void;
  onSuccess: () => void;
}

const emptyForm: Omit<AdminDeliveryTown, 'id'> = {
  code: '',
  nameAr: '',
  nameEn: '',
  zoneCode: '',
  feeOverride: null,
  active: true,
};

const DeliveryTownDialog: React.FC<DeliveryTownDialogProps> = ({ visible, town, onHide, onSuccess }) => {
  const [form, setForm] = useState<Omit<AdminDeliveryTown, 'id'>>(emptyForm);
  const createTown = useCreateTown();
  const updateTown = useUpdateTown();
  const { data: zones = [] } = useAdminZones();
  const { t } = useTranslation();

  useEffect(() => {
    if (!visible) return;
    if (town) {
      setForm({
        code: town.code,
        nameAr: town.nameAr,
        nameEn: town.nameEn,
        zoneCode: town.zoneCode,
        feeOverride: town.feeOverride ?? null,
        active: town.active,
      });
    } else {
      setForm(emptyForm);
    }
  }, [visible, town]);

  const isSaving = createTown.isPending || updateTown.isPending;

  const handleSave = async () => {
    const payload = {
      ...form,
      feeOverride:
        form.feeOverride === null || form.feeOverride === undefined || (form.feeOverride as any) === ''
          ? null
          : Number(form.feeOverride),
    } as Omit<AdminDeliveryTown, 'id'>;
    if (town) {
      await updateTown.mutateAsync({ id: town.id, ...payload });
    } else {
      await createTown.mutateAsync(payload);
    }
    onSuccess();
  };

  const zoneOptions = useMemo(
    () => zones.map((z) => ({ label: `${z.nameEn} (${z.code})`, value: z.code })),
    [zones]
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={town ? t('delivery.towns.editTitle') : t('delivery.towns.addTitle')}
      footer={
        <Flex justify="end" spacing="s">
          <Button appearance="outline" onClick={onHide} isDisabled={isSaving}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            {town ? t('common.update') : t('common.create')}
          </Button>
        </Flex>
      }
    >
      <Flex direction="vertical" spacing="m">
        <FieldWrapper label={t('delivery.fields.code')} required fullWidth>
          <StringInput
            fullWidth
            value={form.code}
            onChange={(val) => setForm((f) => ({ ...f, code: String(val ?? '') }))}
          />
        </FieldWrapper>
        <FieldWrapper label={t('delivery.fields.nameEn')} required fullWidth>
          <StringInput
            fullWidth
            value={form.nameEn}
            onChange={(val) => setForm((f) => ({ ...f, nameEn: String(val ?? '') }))}
          />
        </FieldWrapper>
        <FieldWrapper label={t('delivery.fields.nameAr')} required fullWidth>
          <StringInput
            fullWidth
            value={form.nameAr}
            onChange={(val) => setForm((f) => ({ ...f, nameAr: String(val ?? '') }))}
          />
        </FieldWrapper>
        <FieldWrapper label={t('delivery.fields.zone')} required fullWidth>
          <Select
            options={zoneOptions}
            value={form.zoneCode}
            onChange={(val: any) => setForm((f) => ({ ...f, zoneCode: val as string }))}
            placeholder={t('delivery.placeholders.selectZone')}
          />
        </FieldWrapper>
        <FieldWrapper label={t('delivery.fields.feeOverride')} fullWidth>
          <StringInput
            type="number"
            fullWidth
            value={form.feeOverride ?? ''}
            onChange={(val) => setForm((f) => ({ ...f, feeOverride: (val === null || val === undefined || Number.isNaN(val as any)) ? null : Number(val) }))}
            placeholder={t('delivery.placeholders.leaveBlankForDefault')}
          />
        </FieldWrapper>
        <FieldWrapper label={t('delivery.fields.active')}>
          <Flex align="center" spacing="s">
            <Checkbox
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            <span>{t('delivery.fields.active')}</span>
          </Flex>
        </FieldWrapper>
      </Flex>
    </Dialog>
  );
};

export default DeliveryTownDialog;
