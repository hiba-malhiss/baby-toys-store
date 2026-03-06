import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Dialog, Flex, Button, StringInput, Toggle } from '@baby-toys/ui-kit';

import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { getSupportedLocales } from '../../i18n/locale';
import { useCreateAttributeValue, useUpdateAttributeValue } from '../../api/attributeApi';
import { AttributeValueAdminDto } from '../../api/types/attribute.ts';

const schema = z.object({
  code: z.string().optional().default(''),
  // ✅ enforce non-empty record keys
  translations: z.record(
    z.string().min(1),
    z.object({
      display: z.string().optional().default(''),
    })
  ),
  sortOrder: z.coerce.number().int().nonnegative().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

type FormValues = z.infer<typeof schema>;

export type ValueUpsertDialogProps = {
  mode: 'create' | 'edit';
  visible: boolean;
  onClose: () => void;
  typeId?: number;
  initial?: AttributeValueAdminDto | null;
  onSuccess?: () => void;
};

const ValueUpsertDialog: React.FC<ValueUpsertDialogProps> = ({
  mode,
  visible,
  onClose,
  typeId,
  initial,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const isEdit = mode === 'edit';

  // ✅ ensure locales are valid record keys (non-empty strings)
  const locales = useMemo(() => {
    const raw = getSupportedLocales();
    return (raw || []).map((x: any) => String(x ?? '').trim()).filter((x: string) => x.length > 0);
  }, []);

  const createHook = useCreateAttributeValue(typeId || 0);
  const updateHook = useUpdateAttributeValue(typeId); // cache invalidation

  const rhf = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', translations: {} },
  });

  useEffect(() => {
    if (!visible) return;

    const normalize = (x: any) => String(x ?? '').toLowerCase();
    const trList = (initial?.translations || []) as Array<{
      locale: string;
      displayValue?: string;
    }>;

    const defaults: FormValues = {
      code: initial?.code ?? '',
      translations: {},
      sortOrder: initial?.sortOrder ?? 0,
      isActive: initial?.isActive ?? true,
    };

    locales.forEach((loc) => {
      const tr = trList.find((x) => normalize(x?.locale) === normalize(loc));
      defaults.translations[loc] = { display: tr?.displayValue || '' };
    });

    rhf.reset(defaults);
  }, [visible, initial, locales, rhf]);

  const onSubmit = async (values: FormValues) => {
    const displayByLocale: Record<string, string> = {};

    Object.entries(values.translations || {}).forEach(([locale, tr]) => {
      const cleanLocale = String(locale ?? '').trim();
      if (!cleanLocale) return;

      const txt = String(tr?.display ?? '').trim();
      if (txt) displayByLocale[cleanLocale] = txt;
    });

    try {
      if (!isEdit) {
        const code = String(values.code ?? '').trim();
        const payload: any = {
          sortOrder: values.sortOrder ?? 0,
          isActive: values.isActive ?? true,
          displayByLocale: Object.keys(displayByLocale).length ? displayByLocale : undefined,
        };
        if (code) payload.code = code; // include code only if provided
        await createHook.mutateAsync(payload);
      } else if (initial?.id) {
        await updateHook.mutateAsync({
          valueId: initial.id,
          sortOrder: values.sortOrder ?? 0,
          isActive: values.isActive ?? true,
          displayByLocale: Object.keys(displayByLocale).length ? displayByLocale : undefined,
        });
      }

      onSuccess?.();
      onClose();
    } catch {
      // error toast handled by caller typically
    }
  };

  const ToggleFieldAdapter: React.FC<{
    value?: boolean;
    onChange?: (v: boolean) => void;
    isDisabled?: boolean;
  }> = ({ value, onChange, isDisabled }) => (
    <Toggle value={!!value} onChange={(v) => onChange?.(!!v)} disabled={isDisabled} />
  );

  const headerText = !isEdit
    ? t('attributes.addValue', { defaultValue: 'Add Value' })
    : t('common.edit', { defaultValue: 'Edit' });

  return (
    <Dialog header={headerText} visible={visible} onHide={onClose} dismissibleMask modal>
      <form onSubmit={rhf.handleSubmit(onSubmit)}>
        <Flex direction="vertical" spacing="m">
          {locales.map((loc) => (
            <FormFieldWrapper
              key={loc}
              name={`translations.${loc}.display`}
              control={rhf.control}
              label={`${t('attributes.display', { defaultValue: 'Display' })} (${loc.toUpperCase()})`}
            >
              <StringInput isDisabled={rhf.formState.isSubmitting} />
            </FormFieldWrapper>
          ))}

          <Flex spacing="l" wrap>
            <FormFieldWrapper
              name="sortOrder"
              control={rhf.control}
              label={t('attributes.sortOrder', { defaultValue: 'Sort Order' })}
            >
              <StringInput type="number" isDisabled={rhf.formState.isSubmitting} />
            </FormFieldWrapper>

            <FormFieldWrapper
              name="isActive"
              control={rhf.control}
              label={t('attributes.active', { defaultValue: 'Active' })}
            >
              <ToggleFieldAdapter isDisabled={rhf.formState.isSubmitting} />
            </FormFieldWrapper>
          </Flex>
          <FormFieldWrapper
            name="code"
            control={rhf.control}
            label={t('attributes.code', { defaultValue: 'Code' })}
            fullWidth
          >
            <StringInput isDisabled={rhf.formState.isSubmitting || isEdit} />
          </FormFieldWrapper>

          <Flex justify="end" spacing="s">
            <Button appearance="outline" type="button" onClick={onClose}>
              {t('app.cancel', { defaultValue: 'Cancel' })}
            </Button>

            <Button type="submit" isLoading={isEdit ? updateHook.isPending : createHook.isPending}>
              {!isEdit
                ? t('app.save', { defaultValue: 'Save' })
                : t('common.update', { defaultValue: 'Update' })}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Dialog>
  );
};

export default ValueUpsertDialog;
