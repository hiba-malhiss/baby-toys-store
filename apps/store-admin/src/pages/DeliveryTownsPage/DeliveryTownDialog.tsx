import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  Button,
  Flex,
  FieldWrapper,
  StringInput,
  Checkbox,
  Select,
} from '@baby-toys/ui-kit';
import type { AdminDeliveryTown, Translation } from '../../api/deliveryLocationsApi';
import { useCreateTown, useUpdateTown, useAdminZones } from '../../api/deliveryLocationsApi';
import { useTranslation } from 'react-i18next';
import { getSupportedLocales } from '../../i18n/locale';

export interface DeliveryTownDialogProps {
  visible: boolean;
  town?: AdminDeliveryTown;
  onHide: () => void;
  onSuccess: () => void;
}

const emptyForm: Omit<AdminDeliveryTown, 'id'> = {
  code: '',
  zoneCode: '',
  feeOverride: null,
  active: true,
  translations: [],
};

const DeliveryTownDialog: React.FC<DeliveryTownDialogProps> = ({
  visible,
  town,
  onHide,
  onSuccess,
}) => {
  const [form, setForm] = useState<Omit<AdminDeliveryTown, 'id'>>(emptyForm);
  const createTown = useCreateTown();
  const updateTown = useUpdateTown();
  const { data: zones = [] } = useAdminZones();
  const { t } = useTranslation();

  useEffect(() => {
    if (!visible) return;
    if (town) {
      setForm(() => {
        const supported = getSupportedLocales();
        const byLocale = new Map(
          (town.translations || []).map((t) => [String(t.locale || '').toLowerCase(), t])
        );
        const translations = supported.map((loc) => {
          const found = byLocale.get(loc.toLowerCase());
          return found
            ? { locale: loc, displayName: found.displayName || '' }
            : { locale: loc, displayName: '' };
        });
        return {
          code: town.code,
          zoneCode: town.zoneCode,
          feeOverride: town.feeOverride ?? null,
          active: town.active,
          translations,
        };
      });
    } else {
      const supported = getSupportedLocales();
      setForm({
        ...emptyForm,
        translations: supported.map((loc) => ({ locale: loc, displayName: '' })),
      });
    }
  }, [visible, town]);

  const isSaving = createTown.isPending || updateTown.isPending;

  const handleSave = async () => {
    const payload = {
      ...form,
      feeOverride:
        form.feeOverride === null ||
        form.feeOverride === undefined ||
        (form.feeOverride as any) === ''
          ? null
          : Number(form.feeOverride),
      translations: (form.translations || []).map((t) => ({
        locale: String(t.locale || '')
          .trim()
          .toLowerCase(),
        displayName: String(t.displayName || '').trim(),
      })) as Translation[],
    } as Omit<AdminDeliveryTown, 'id'>;
    if (town) {
      await updateTown.mutateAsync({ id: town.id, ...payload });
    } else {
      await createTown.mutateAsync(payload);
    }
    onSuccess();
  };

  const zoneOptions = useMemo(
    () => zones.map((z) => ({ label: `${z.code}`, value: z.code })),
    [zones]
  );

  const updateTranslation = (idx: number, patch: Partial<Translation>) =>
    setForm((f) => ({
      ...f,
      translations: (f.translations || []).map((tr, i) => (i === idx ? { ...tr, ...patch } : tr)),
    }));

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
        <FieldWrapper label={t('delivery.fields.translations')} fullWidth>
          <Flex direction="vertical" spacing="s">
            {(form.translations || []).map((tr, idx) => (
              <Flex key={idx} spacing="s" align="end">
                <div>{tr.locale}</div>
                <FieldWrapper label={t('delivery.fields.displayName')} required fullWidth>
                  <StringInput
                    fullWidth
                    value={tr.displayName}
                    onChange={(val) => updateTranslation(idx, { displayName: String(val ?? '') })}
                  />
                </FieldWrapper>
              </Flex>
            ))}
          </Flex>
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
            onChange={(val) =>
              setForm((f) => ({
                ...f,
                feeOverride:
                  val === null || val === undefined || Number.isNaN(val as any)
                    ? null
                    : Number(val),
              }))
            }
            placeholder={t('delivery.placeholders.leaveBlankForDefault')}
          />
        </FieldWrapper>
        <FieldWrapper label={t('delivery.fields.active')}>
          <Flex align="center" spacing="s">
            <Checkbox
              checked={form.active}
              onChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
            />
            <span>{t('delivery.fields.active')}</span>
          </Flex>
        </FieldWrapper>
      </Flex>
    </Dialog>
  );
};

export default DeliveryTownDialog;
