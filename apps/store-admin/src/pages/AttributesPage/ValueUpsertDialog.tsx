import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Dialog, Button, StringInput, Toggle, useToast, LocaleBadge } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { useLocales } from '../../hooks/useLocales';
import { useCreateAttributeValue, useUpdateAttributeValue } from '../../api/attributeApi';
import { AttributeValueAdminDto } from '../../api/types/attribute.ts';
import styles from './attributes.module.scss';

const schema = z.object({
  code: z.string().optional().default(''),
  translations: z.record(z.string().min(1), z.object({ display: z.string().min(1, 'Required') })),
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
  const toast = useToast();
  const locales = useLocales();
  const createHook = useCreateAttributeValue(typeId || 0);
  const updateHook = useUpdateAttributeValue(typeId);

  const rhf = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', translations: {} },
    mode: 'onChange',
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
  }, [visible, initial?.id]);

  const onSubmit = async (values: FormValues) => {
    const displayByLocale: Record<string, string> = {};
    Object.entries(values.translations || {}).forEach(([locale, tr]) => {
      const txt = String(tr?.display ?? '').trim();
      if (txt) displayByLocale[locale] = txt;
    });

    try {
      if (!isEdit) {
        const code = String(values.code ?? '').trim();
        const payload: any = {
          sortOrder: values.sortOrder ?? 0,
          isActive: values.isActive ?? true,
          displayByLocale: Object.keys(displayByLocale).length ? displayByLocale : undefined,
        };
        if (code) payload.code = code;
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
    } catch (e: any) {
      toast.error(e?.message || t('app.unexpectedError'));
    }
  };

  const ToggleAdapter: React.FC<{ value?: boolean; onChange?: (v: boolean) => void }> = ({
    value,
    onChange,
  }) => <Toggle value={!!value} onChange={(v) => onChange?.(!!v)} />;

  const footer = (
    <>
      <Button appearance="outline" type="button" onClick={onClose}>
        {t('app.cancel', { defaultValue: 'Cancel' })}
      </Button>
      <Button
        type="submit"
        isLoading={isEdit ? updateHook.isPending : createHook.isPending}
        isDisabled={isEdit ? updateHook.isPending : createHook.isPending}
      >
        {isEdit
          ? t('common.update', { defaultValue: 'Update' })
          : t('app.save', { defaultValue: 'Save' })}
      </Button>
    </>
  );

  return (
    <Dialog
      header={
        isEdit
          ? t('common.edit', { defaultValue: 'Edit Value' })
          : t('attributes.addValue', { defaultValue: 'Add Value' })
      }
      visible={visible}
      onHide={onClose}
      dismissibleMask
      modal
      footer={footer}
    >
      <form
        onSubmit={rhf.handleSubmit(onSubmit, () =>
          toast.error(t('app.formInvalid', { defaultValue: 'Fix errors' }))
        )}
      >
        <div className={styles.dialogBody}>
          {/* Display labels per locale */}
          <div className={styles.dialogSection}>
            <div className={styles.dialogSectionLabel}>
              {t('attributes.display', { defaultValue: 'Display Labels' })}
            </div>
            {locales.map((loc) => (
              <FormFieldWrapper
                key={loc}
                name={`translations.${loc}.display`}
                control={rhf.control}
                label={
                  <>
                    <LocaleBadge locale={loc} />
                    {t('attributes.display', { defaultValue: 'Label' })}
                  </>
                }
                required
                fullWidth
              >
                <StringInput isDisabled={rhf.formState.isSubmitting} />
              </FormFieldWrapper>
            ))}
          </div>

          {/* Meta */}
          <div className={styles.dialogSection}>
            <div className={styles.dialogSectionLabel}>
              {t('attributes.meta', { defaultValue: 'Meta' })}
            </div>
            <div className={styles.metaRow}>
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
                <ToggleAdapter />
              </FormFieldWrapper>
            </div>
            {!isEdit && (
              <FormFieldWrapper
                name="code"
                control={rhf.control}
                label={t('attributes.code', { defaultValue: 'Code (optional)' })}
                fullWidth
              >
                <StringInput isDisabled={rhf.formState.isSubmitting} placeholder="auto" />
              </FormFieldWrapper>
            )}
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default ValueUpsertDialog;
