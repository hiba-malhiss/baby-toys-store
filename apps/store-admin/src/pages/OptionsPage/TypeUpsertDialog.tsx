import React, { useEffect, useMemo } from 'react';
import { Dialog, Button, Flex, StringInput, Toggle } from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';
import { getSupportedLocales } from '../../i18n/locale';
import { useCreateOptionType, useUpdateOptionType, useOptionTypeDetail } from '../../api/optionApi';
import type { OptionTypeDto } from '../../api/types/option';
import { useToast } from '@baby-toys/ui-kit';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export type TypeUpsertDialogProps = {
  visible: boolean;
  mode: 'create' | 'edit';
  initial?: OptionTypeDto | null;
  onClose: () => void;
  onSuccess?: () => void;
};

const schema = z.object({
  code: z.string().optional().default(''),
  isFilterable: z.boolean().optional().default(false),
  translations: z.record(
    z.string().min(1),
    z.object({
      displayName: z.string().min(1, 'Required'),
      description: z.string().optional().default(''),
    })
  ),
});

type FormValues = z.infer<typeof schema>;

const TypeUpsertDialog: React.FC<TypeUpsertDialogProps> = ({
  visible,
  mode,
  initial,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const locales = useMemo(() => getSupportedLocales(), []);
  const createType = useCreateOptionType();
  const updateType = useUpdateOptionType();
  const toast = useToast();

  const typeId = initial?.id;
  const { data: detail } = useOptionTypeDetail(typeId);

  const rhf = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', isFilterable: false, translations: {} },
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const onInvalid = async () => {
    toast.error(t('app.formInvalid', { defaultValue: 'Please fix the highlighted fields.' }));
  };

  useEffect(() => {
    if (!visible) return;

    const src: any = (detail as any)?.type || initial || {};
    const defaults: FormValues = {
      code: src?.code || '',
      isFilterable: Boolean(src?.isFilterable) || false,
      translations: {},
    };

    const normalize = (x: any) => String(x ?? '').toLowerCase();
    const trList: Array<{ locale: string; displayName?: string; description?: string }> =
      src?.translations || [];

    locales.forEach((loc) => {
      const tr = trList.find((x) => normalize(x?.locale) === normalize(loc));
      defaults.translations[loc] = {
        displayName: tr?.displayName || '',
        description: tr?.description || '',
      };
    });

    rhf.reset(defaults);
  }, [visible, initial, detail, locales, rhf]);

  const onSubmit = async (values: FormValues) => {
    const code = String(values.code ?? '').trim();
    const isFilterable = Boolean(values.isFilterable);

    const translations = Object.entries(values.translations || {})
      .map(([locale, tr]) => {
        const displayName = String(tr?.displayName ?? '').trim();
        const description = String(tr?.description ?? '').trim();
        if (!displayName && !description) return null;

        return {
          locale,
          displayName: displayName || undefined,
          description: description || undefined,
        };
      })
      .filter(Boolean) as Array<{ locale: string; displayName?: string; description?: string }>;

    try {
      if (mode === 'edit' && initial?.id) {
        await updateType.mutateAsync({
          id: initial.id,
          payload: { code: code || undefined, isFilterable, translations } as any,
        });
      } else {
        await createType.mutateAsync({
          code: code || undefined,
          isFilterable,
          translations,
        } as any);
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
      : t('options.addType', { defaultValue: 'Add Option Type' });

  return (
    <Dialog
      header={headerText}
      visible={visible}
      onVisibleChange={onClose as any}
      dismissibleMask
      modal
    >
      <form onSubmit={rhf.handleSubmit(onSubmit, onInvalid)}>
        <Flex direction="vertical" spacing="m">
          <FormFieldWrapper
            name="isFilterable"
            label={t('options.isFilterable', {
              defaultValue: 'Filterable (usable in product filters)',
            })}
            control={rhf.control}
          >
            <Toggle />
          </FormFieldWrapper>

          {locales.map((loc) => (
            <React.Fragment key={loc}>
              <FormFieldWrapper
                name={`translations.${loc}.displayName`}
                label={`${t('options.displayName', { defaultValue: 'Display Name' })} (${String(loc).toUpperCase()})`}
                control={rhf.control}
                required
                rules={
                  String(loc).toLowerCase() === 'en'
                    ? { required: t('common.required', { defaultValue: 'Required' }) }
                    : undefined
                }
              >
                <StringInput
                  placeholder={t('options.displayName', { defaultValue: 'Display Name' })}
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                name={`translations.${loc}.description`}
                label={`${t('options.description', { defaultValue: 'Description' })} (${String(loc).toUpperCase()})`}
                control={rhf.control}
              >
                <StringInput
                  placeholder={t('options.description', { defaultValue: 'Description' })}
                />
              </FormFieldWrapper>
            </React.Fragment>
          ))}
          <FormFieldWrapper
            name="code"
            label={t('options.typeCode', { defaultValue: 'Code' })}
            control={rhf.control}
          >
            <StringInput placeholder={t('options.typeCode', { defaultValue: 'Code' })} />
          </FormFieldWrapper>

          <Flex justify="end" spacing="s">
            <Button appearance="outline" type="button" onClick={onClose}>
              {t('app.cancel', { defaultValue: 'Cancel' })}
            </Button>

            <Button
              type="submit"
              isLoading={mode === 'edit' ? updateType.isPending : createType.isPending}
              isDisabled={mode === 'edit' ? updateType.isPending : createType.isPending}
            >
              {t('app.save', { defaultValue: 'Save' })}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Dialog>
  );
};

export default TypeUpsertDialog;
