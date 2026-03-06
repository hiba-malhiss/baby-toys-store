import React, { useEffect, useMemo } from 'react';
import { Dialog, Button, Flex, StringInput } from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useToast } from '@baby-toys/ui-kit';

import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';
import { getSupportedLocales } from '../../i18n/locale';
import { useCreateOptionValue, useUpdateOptionValue } from '../../api/optionApi';
import type { OptionValueDto } from '../../api/types/option';

export type ValueUpsertDialogProps = {
  visible: boolean;
  mode: 'create' | 'edit';
  typeId: number;
  initial?: OptionValueDto | null;
  onClose: () => void;
  onSuccess?: () => void;
};

type FormValues = {
  code: string;
  translations: Record<string, { display?: string }>;
};

const ValueUpsertDialog: React.FC<ValueUpsertDialogProps> = ({
  visible,
  mode,
  typeId,
  initial,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const locales = useMemo(() => getSupportedLocales(), []);
  const createValue = useCreateOptionValue(typeId);
  const updateValue = useUpdateOptionValue(typeId);

  const rhf = useForm<FormValues>({
    defaultValues: { code: '', translations: {} },
  });

  useEffect(() => {
    if (!visible) return;

    const defaults: FormValues = {
      code: initial?.code || '',
      translations: {},
    };

    const normalize = (x: any) => String(x ?? '').toLowerCase();
    const trList = (initial?.translations || []) as Array<{ locale: string; display?: string }>;

    locales.forEach((loc) => {
      const tr = trList.find((x) => normalize(x?.locale) === normalize(loc));
      defaults.translations[loc] = { display: tr?.display || '' };
    });

    rhf.reset(defaults);
  }, [visible, initial, locales, rhf]);

  const onSubmit = async (values: FormValues) => {
    const codeRaw = String(values.code ?? '').trim();
    const hasCode = !!codeRaw;

    const translations: Record<string, string> = {};
    Object.entries(values.translations || {}).forEach(([loc, tr]) => {
      const txt = String(tr?.display ?? '').trim();
      if (txt) translations[loc] = txt;
    });

    try {
      if (mode === 'edit' && initial?.id) {
        const payload: { value?: string; translations?: Record<string, string> } = {};
        if (hasCode) payload.value = codeRaw; // only send if user supplied a code
        if (Object.keys(translations).length) payload.translations = translations;

        await updateValue.mutateAsync({ valueId: initial.id, payload });
      } else {
        const displayByLocale = Object.keys(translations).length ? translations : undefined;
        await createValue.mutateAsync({ code: hasCode ? codeRaw : undefined, displayByLocale });
      }

      onSuccess?.();
      onClose();
    } catch (e: any) {
      toast.error(e?.message || t('app.unexpectedError'));
    }
  };

  const headerText =
    mode === 'edit'
      ? t('common.edit', { defaultValue: 'Edit' })
      : t('options.addValue', { defaultValue: 'Add Value' });

  return (
    <Dialog
      header={headerText}
      visible={visible}
      onVisibleChange={onClose as any}
      dismissibleMask
      modal
    >
      <form onSubmit={rhf.handleSubmit(onSubmit)}>
        <Flex direction="vertical" spacing="m">
          <FormFieldWrapper
            name="code"
            label={t('options.value', { defaultValue: 'Value' })}
            control={rhf.control}
          >
            <StringInput placeholder={t('options.value', { defaultValue: 'Value' })} />
          </FormFieldWrapper>

          {locales.map((loc) => (
            <FormFieldWrapper
              key={loc}
              name={`translations.${loc}.display`}
              label={`${t('options.displayName', { defaultValue: 'Display Name' })} (${String(loc).toUpperCase()})`}
              control={rhf.control}
            >
              <StringInput
                placeholder={t('options.displayName', { defaultValue: 'Display Name' })}
              />
            </FormFieldWrapper>
          ))}

          <Flex justify="end" spacing="s">
            <Button appearance="outline" type="button" onClick={onClose}>
              {t('app.cancel', { defaultValue: 'Cancel' })}
            </Button>

            <Button
              type="submit"
              isLoading={mode === 'edit' ? updateValue.isPending : createValue.isPending}
            >
              {t('app.save', { defaultValue: 'Save' })}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Dialog>
  );
};

export default ValueUpsertDialog;
