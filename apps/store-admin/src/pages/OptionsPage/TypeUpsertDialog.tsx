import React, { useEffect, useMemo } from 'react';
import { Dialog, Button, Flex, StringInput } from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';
import { getSupportedLocales } from '../../i18n/locale';
import { useCreateOptionType, useUpdateOptionType, useOptionTypeDetail } from '../../api/optionApi';
import type { OptionTypeDto } from '../../api/types/option';
import { useToast } from '@baby-toys/ui-kit';

export type TypeUpsertDialogProps = {
  visible: boolean;
  mode: 'create' | 'edit';
  initial?: OptionTypeDto | null;
  onClose: () => void;
  onSuccess?: () => void;
};

type FormValues = {
  name: string;
  translations: Record<
    string,
    {
      displayName?: string;
      description?: string;
    }
  >;
};

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
    defaultValues: { name: '', translations: {} },
  });

  useEffect(() => {
    if (!visible) return;

    // Prefer detailed payload when available (has full translations)
    const src: any = (detail as any)?.type || initial || {};

    const defaults: FormValues = {
      name: src?.name || '',
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
    const name = String(values.name ?? '').trim();
    if (!name) return;

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
        await updateType.mutateAsync({ id: initial.id, payload: { name, translations } });
      } else {
        await createType.mutateAsync({ name, translations });
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
      <form onSubmit={rhf.handleSubmit(onSubmit)}>
        <Flex direction="vertical" spacing="m">
          <FormFieldWrapper
            name="name"
            label={t('options.typeName', { defaultValue: 'Name' })}
            required
            control={rhf.control}
          >
            <StringInput placeholder={t('options.typeName', { defaultValue: 'Name' })} />
          </FormFieldWrapper>

          {locales.map((loc) => (
            <React.Fragment key={loc}>
              <FormFieldWrapper
                name={`translations.${loc}.displayName`}
                label={`${t('options.displayName', { defaultValue: 'Display Name' })} (${String(loc).toUpperCase()})`}
                control={rhf.control}
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

          <Flex justify="end" spacing="s">
            <Button appearance="outline" type="button" onClick={onClose}>
              {t('app.cancel', { defaultValue: 'Cancel' })}
            </Button>

            <Button
              type="submit"
              isLoading={mode === 'edit' ? updateType.isPending : createType.isPending}
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
