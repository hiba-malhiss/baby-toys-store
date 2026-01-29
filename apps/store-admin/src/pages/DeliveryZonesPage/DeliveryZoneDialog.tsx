import React, { useEffect, useState } from 'react';
import { Dialog, Button, Flex, FieldWrapper, StringInput, Checkbox } from '@baby-toys/ui-kit';
import type { AdminDeliveryZone } from '../../api/deliveryLocationsApi';
import { useCreateZone, useUpdateZone } from '../../api/deliveryLocationsApi';
import { useTranslation } from 'react-i18next';

export interface DeliveryZoneDialogProps {
  visible: boolean;
  zone?: AdminDeliveryZone;
  onHide: () => void;
  onSuccess: () => void;
}

const emptyForm: Omit<AdminDeliveryZone, 'id'> = {
  code: '',
  nameAr: '',
  nameEn: '',
  defaultFee: 0,
  active: true,
};

const DeliveryZoneDialog: React.FC<DeliveryZoneDialogProps> = ({
  visible,
  zone,
  onHide,
  onSuccess,
}) => {
  const [form, setForm] = useState<Omit<AdminDeliveryZone, 'id'>>(emptyForm);
  const createZone = useCreateZone();
  const updateZone = useUpdateZone();
  const { t } = useTranslation();

  useEffect(() => {
    if (!visible) return;
    if (zone) {
      setForm({
        code: zone.code,
        nameAr: zone.nameAr,
        nameEn: zone.nameEn,
        defaultFee: Number(zone.defaultFee),
        active: zone.active,
      });
    } else {
      setForm(emptyForm);
    }
  }, [visible, zone]);

  const isSaving = createZone.isPending || updateZone.isPending;

  const handleSave = async () => {
    const payload = { ...form, defaultFee: Number(form.defaultFee) } as Omit<
      AdminDeliveryZone,
      'id'
    >;
    if (zone) {
      await updateZone.mutateAsync({ id: zone.id, ...payload });
    } else {
      await createZone.mutateAsync(payload);
    }
    onSuccess();
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={zone ? t('delivery.zones.editTitle') : t('delivery.zones.addTitle')}
      footer={
        <Flex justify="end" spacing="s">
          <Button appearance="outline" onClick={onHide} isDisabled={isSaving}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            {zone ? t('common.update') : t('common.create')}
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
        <FieldWrapper label={t('delivery.fields.defaultFee')} required fullWidth>
          <StringInput
            type="number"
            fullWidth
            value={form.defaultFee}
            onChange={(val) => setForm((f) => ({ ...f, defaultFee: Number(val ?? 0) }))}
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

export default DeliveryZoneDialog;
