import React, { useEffect, useState } from 'react';
import { Dialog, Button, Flex, FieldWrapper, StringInput, Checkbox } from '@baby-toys/ui-kit';
import type { AdminDeliveryZone, Translation } from '../../api/deliveryLocationsApi';
import { useCreateZone, useUpdateZone } from '../../api/deliveryLocationsApi';
import { useTranslation } from 'react-i18next';
import { getSupportedLocales } from '../../i18n/locale';

export interface DeliveryZoneDialogProps {
  visible: boolean;
  zone?: AdminDeliveryZone;
  onHide: () => void;
  onSuccess: () => void;
}

const emptyForm: Omit<AdminDeliveryZone, 'id'> = {
  code: '',
  defaultFee: 0,
  active: true,
  translations: [],
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

  const supportedLocales = getSupportedLocales();

  const ensureAllLocales = (list: Translation[] | undefined): Translation[] => {
    const byLocale = new Map((list || []).map((t) => [String(t.locale || '').toLowerCase(), t]));
    return supportedLocales.map((loc) => {
      const found = byLocale.get(loc.toLowerCase());
      return found
        ? { locale: loc, displayName: found.displayName || '' }
        : { locale: loc, displayName: '' };
    });
  };

  useEffect(() => {
    if (!visible) return;
    if (zone) {
      setForm({
        code: zone.code,
        defaultFee: Number(zone.defaultFee),
        active: zone.active,
        translations: ensureAllLocales(zone.translations),
      });
    } else {
      setForm({ ...emptyForm, translations: ensureAllLocales([]) });
    }
  }, [visible, zone]);

  const isSaving = createZone.isPending || updateZone.isPending;

  const handleSave = async () => {
    const payload = {
      ...form,
      defaultFee: Number(form.defaultFee),
      translations: (form.translations || []).map((t) => ({
        locale: String(t.locale || '')
          .trim()
          .toLowerCase(),
        displayName: String(t.displayName || '').trim(),
      })) as Translation[],
    } as Omit<AdminDeliveryZone, 'id'>;
    if (zone) {
      await updateZone.mutateAsync({ id: zone.id, ...payload });
    } else {
      await createZone.mutateAsync(payload);
    }
    onSuccess();
  };

  const updateTranslation = (idx: number, patch: Partial<Translation>) =>
    setForm((f) => ({
      ...f,
      translations: (f.translations || []).map((tr, i) => (i === idx ? { ...tr, ...patch } : tr)),
    }));

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
        <FieldWrapper label={t('delivery.fields.translations')} fullWidth>
          <Flex direction="vertical" spacing="s">
            {(form.translations || []).map((tr, idx) => (
                <FieldWrapper label={t('delivery.fields.displayName') + ' ' + tr.locale} required fullWidth>
                  <StringInput
                    fullWidth
                    value={tr.displayName}
                    onChange={(val) => updateTranslation(idx, { displayName: String(val ?? '') })}
                  />
                </FieldWrapper>
            ))}
          </Flex>
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
