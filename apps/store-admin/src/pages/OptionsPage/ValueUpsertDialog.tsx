import React, { useEffect } from 'react';
import { Dialog, Button, StringInput, useToast, LocaleBadge } from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';
import { useLocales } from '../../hooks/useLocales';
import { useCreateOptionValue, useUpdateOptionValue } from '../../api/optionApi';
import type { OptionValueDto } from '../../api/types/option';
import styles from './options.module.scss';

export type ValueUpsertDialogProps = {
  visible: boolean;
  mode: 'create' | 'edit';
  typeId: number;
  initial?: OptionValueDto | null;
  onClose: () => void;
  onSuccess?: () => void;
};

const schema = z.object({
  code: z.string().optional().default(''),
  translations: z.record(z.string().min(1), z.object({ display: z.string().min(1, 'Required') })),
});

type FormValues = z.infer<typeof schema>;

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
  const locales = useLocales();
  const isEdit = mode === 'edit';
  const createValue = useCreateOptionValue(typeId);
  const updateValue = useUpdateOptionValue(typeId);

  const rhf = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', translations: {} },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!visible) return;
    const normalize = (x: any) => String(x ?? '').toLowerCase();
    const trList = (initial?.translations || []) as Array<{ locale: string; display?: string }>;
    const defaults: FormValues = { code: initial?.code || '', translations: {} };
    locales.forEach((loc) => {
      const tr = trList.find((x) => normalize(x?.locale) === normalize(loc));
      defaults.translations[loc] = { display: tr?.display || '' };
    });
    rhf.reset(defaults);
  }, [visible, initial?.id]);

  const onSubmit = async (values: FormValues) => {
    const codeRaw = String(values.code ?? '').trim();
    const hasCode = !!codeRaw;
    const translations: Record<string, string> = {};
    Object.entries(values.translations || {}).forEach(([loc, tr]) => {
      const txt = String(tr?.display ?? '').trim();
      if (txt) translations[loc] = txt;
    });

    try {
      if (isEdit && initial?.id) {
        const payload: { value?: string; translations?: Record<string, string> } = {};
        if (hasCode) payload.value = codeRaw;
        if (Object.keys(translations).length) payload.translations = translations;
        await updateValue.mutateAsync({ valueId: initial.id, payload });
      } else {
        await createValue.mutateAsync({
          code: hasCode ? codeRaw : undefined,
          displayByLocale: Object.keys(translations).length ? translations : undefined,
        });
      }
      onSuccess?.();
      onClose();
    } catch (e: any) {
      toast.error(e?.message || t('app.unexpectedError'));
    }
  };

  const footer = (
    <>
      <Button appearance="outline" type="button" onClick={onClose}>
        {t('app.cancel', { defaultValue: 'Cancel' })}
      </Button>
      <Button
        type="submit"
        isLoading={isEdit ? updateValue.isPending : createValue.isPending}
        isDisabled={isEdit ? updateValue.isPending : createValue.isPending}
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
          : t('options.addValue', { defaultValue: 'Add Value' })
      }
      visible={visible}
      onVisibleChange={onClose as any}
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
          {/* Display labels */}
          <div className={styles.dialogSection}>
            <div className={styles.dialogSectionLabel}>
              {t('options.display', { defaultValue: 'Display Labels' })}
            </div>
            {locales.map((loc) => (
              <FormFieldWrapper
                key={loc}
                name={`translations.${loc}.display`}
                label={
                  <>
                    <LocaleBadge locale={loc} />
                    {t('options.displayName', { defaultValue: 'Label' })}
                  </>
                }
                control={rhf.control}
                required
                fullWidth
              >
                <StringInput
                  placeholder={t('options.displayName', { defaultValue: 'Display Name' })}
                />
              </FormFieldWrapper>
            ))}
          </div>

          {/* Meta */}
          <div className={styles.dialogSection}>
            <div className={styles.dialogSectionLabel}>
              {t('options.meta', { defaultValue: 'Meta' })}
            </div>
            <FormFieldWrapper
              name="code"
              label={t('options.value', { defaultValue: 'Code / Value (optional)' })}
              control={rhf.control}
              fullWidth
            >
              <StringInput placeholder="auto" isDisabled={isEdit} />
            </FormFieldWrapper>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default ValueUpsertDialog;
