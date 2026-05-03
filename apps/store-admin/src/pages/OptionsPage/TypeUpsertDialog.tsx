import React, { useEffect } from 'react';
import { Dialog, Button, StringInput, Toggle, useToast, LocaleBadge } from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';
import { useLocales } from '../../hooks/useLocales';
import { useCreateOptionType, useUpdateOptionType, useOptionTypeDetail } from '../../api/optionApi';
import type { OptionTypeDto } from '../../api/types/option';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './options.module.scss';

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
  const locales = useLocales();
  const createType = useCreateOptionType();
  const updateType = useUpdateOptionType();
  const toast = useToast();
  const isEdit = mode === 'edit';

  const typeId = initial?.id;
  const { data: detail } = useOptionTypeDetail(typeId);

  const rhf = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', isFilterable: false, translations: {} },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!visible) return;
    const src: any = (detail as any)?.type || initial || {};
    const normalize = (x: any) => String(x ?? '').toLowerCase();
    const trList: Array<{ locale: string; displayName?: string; description?: string }> =
      src?.translations || [];
    const defaults: FormValues = {
      code: src?.code || '',
      isFilterable: Boolean(src?.isFilterable) || false,
      translations: {},
    };
    locales.forEach((loc) => {
      const tr = trList.find((x) => normalize(x?.locale) === normalize(loc));
      defaults.translations[loc] = {
        displayName: tr?.displayName || '',
        description: tr?.description || '',
      };
    });
    rhf.reset(defaults);
  }, [visible, initial?.id, detail?.type?.id]);

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
      .filter(Boolean) as any[];

    try {
      if (isEdit && initial?.id) {
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

  return (
    <Dialog
      header={
        isEdit
          ? t('common.edit', { defaultValue: 'Edit Option Type' })
          : t('options.addType', { defaultValue: 'Add Option Type' })
      }
      visible={visible}
      onVisibleChange={onClose as any}
      dismissibleMask
      modal
    >
      <form
        onSubmit={rhf.handleSubmit(onSubmit, () =>
          toast.error(t('app.formInvalid', { defaultValue: 'Fix errors' }))
        )}
      >
        <div className={styles.dialogBody}>
          {/* Translations */}
          <div className={styles.dialogSection}>
            <div className={styles.dialogSectionLabel}>
              {t('options.content', { defaultValue: 'Content' })}
            </div>
            {locales.map((loc) => (
              <div key={loc} className={styles.localeRow}>
                <FormFieldWrapper
                  name={`translations.${loc}.displayName`}
                  label={
                    <>
                      <LocaleBadge locale={loc} />
                      {t('options.displayName', { defaultValue: 'Name' })}
                    </>
                  }
                  control={rhf.control}
                  required
                >
                  <StringInput
                    placeholder={t('options.displayName', { defaultValue: 'Display Name' })}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper
                  name={`translations.${loc}.description`}
                  label={t('options.description', { defaultValue: 'Description' })}
                  control={rhf.control}
                >
                  <StringInput
                    placeholder={t('options.description', { defaultValue: 'Description' })}
                  />
                </FormFieldWrapper>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className={styles.dialogSection}>
            <div className={styles.dialogSectionLabel}>
              {t('options.settings', { defaultValue: 'Settings' })}
            </div>
            <div className={styles.flagsRow}>
              <FormFieldWrapper
                name="isFilterable"
                label={t('options.isFilterable', { defaultValue: 'Filterable' })}
                control={rhf.control}
              >
                <Toggle />
              </FormFieldWrapper>
            </div>
          </div>

          {/* Meta */}
          <div className={styles.dialogSection}>
            <div className={styles.dialogSectionLabel}>
              {t('options.meta', { defaultValue: 'Meta' })}
            </div>
            <FormFieldWrapper
              name="code"
              label={t('options.typeCode', { defaultValue: 'Code (optional)' })}
              control={rhf.control}
              fullWidth
            >
              <StringInput placeholder="auto" />
            </FormFieldWrapper>
          </div>

          <div className={styles.dialogFooter}>
            <Button appearance="outline" type="button" onClick={onClose}>
              {t('app.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button
              type="submit"
              isLoading={isEdit ? updateType.isPending : createType.isPending}
              isDisabled={isEdit ? updateType.isPending : createType.isPending}
            >
              {isEdit
                ? t('common.update', { defaultValue: 'Update' })
                : t('app.save', { defaultValue: 'Save' })}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default TypeUpsertDialog;
