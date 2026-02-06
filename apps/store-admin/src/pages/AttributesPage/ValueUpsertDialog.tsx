import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Dialog, Flex, Button, StringInput, Toggle } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { useCreateAttributeValue, useUpdateAttributeValue } from '../../api/attributeApi';
import type { AttributeValue } from '../../api/types/attribute';

const schema = z.object({
  code: z.string().min(1),
  displayEn: z.string().optional().default(''),
  displayAr: z.string().optional().default(''),
  sortOrder: z.coerce.number().int().nonnegative().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export type ValueUpsertDialogProps = {
  mode: 'create' | 'edit';
  visible: boolean;
  onClose: () => void;
  typeId?: number; // required for create
  initial?: AttributeValue | null; // used for edit
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

  const defaultValues = React.useMemo(() => {
    const tr = initial?.translations || [];
    const en = tr.find((x: any) => (x?.locale || '').toLowerCase() === 'en');
    const ar = tr.find((x: any) => (x?.locale || '').toLowerCase() === 'ar');
    return {
      code: initial?.code ?? '',
      displayEn: en?.displayValue ?? initial?.display ?? '',
      displayAr: ar?.displayValue ?? '',
      sortOrder: initial?.sortOrder ?? 0,
      isActive: initial?.isActive ?? true,
    };
  }, [initial]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const createHook = useCreateAttributeValue(typeId || 0);
  const updateHook = useUpdateAttributeValue(initial?.id || 0);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const displayByLocale: Record<string, string> = {};
    if (values.displayEn?.trim()) displayByLocale.en = values.displayEn.trim();
    if (values.displayAr?.trim()) displayByLocale.ar = values.displayAr.trim();

    try {
      if (mode === 'create') {
        await createHook.mutateAsync({
          code: values.code.trim(),
          sortOrder: values.sortOrder ?? 0,
          isActive: values.isActive ?? true,
          displayByLocale: Object.keys(displayByLocale).length ? displayByLocale : undefined,
        });
      } else {
        await updateHook.mutateAsync({
          sortOrder: values.sortOrder ?? 0,
          isActive: values.isActive ?? true,
          displayByLocale: Object.keys(displayByLocale).length ? displayByLocale : undefined,
        });
      }
      onSuccess?.();
      onClose();
    } catch (e) {
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
  return (
    <Dialog
      header={
        mode === 'create'
          ? t('attributes.addValue', { defaultValue: 'Add Value' })
          : t('common.edit', { defaultValue: 'Edit' })
      }
      visible={visible}
      onHide={onClose}
      dismissibleMask
      modal
      footer={
        <Button
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
          fullWidth
        >
          {mode === 'create'
            ? t('app.save', { defaultValue: 'Save' })
            : t('common.update', { defaultValue: 'Update' })}
        </Button>
      }
    >
      <Flex direction="vertical" spacing="m">
        <FormFieldWrapper
          name="code"
          control={control}
          label={t('attributes.code', { defaultValue: 'Code' })}
          required
          fullWidth
        >
          <StringInput isDisabled={isSubmitting || mode === 'edit'} />
        </FormFieldWrapper>
        <Flex spacing="l" wrap>
          <FormFieldWrapper
            name="displayEn"
            control={control}
            label={t('attributes.displayEn', { defaultValue: 'Display (EN)' })}
          >
            <StringInput isDisabled={isSubmitting} />
          </FormFieldWrapper>
          <FormFieldWrapper
            name="displayAr"
            control={control}
            label={t('attributes.displayAr', { defaultValue: 'Display (AR)' })}
          >
            <StringInput isDisabled={isSubmitting} />
          </FormFieldWrapper>
        </Flex>
        <Flex spacing="l" wrap>
          <FormFieldWrapper
            name="sortOrder"
            control={control}
            label={t('attributes.sortOrder', { defaultValue: 'Sort Order' })}
          >
            <StringInput type="number" isDisabled={isSubmitting} />
          </FormFieldWrapper>
          <FormFieldWrapper
            name="isActive"
            control={control}
            label={t('attributes.active', { defaultValue: 'Active' })}
          >
            <ToggleFieldAdapter isDisabled={isSubmitting} />
          </FormFieldWrapper>
        </Flex>
      </Flex>
    </Dialog>
  );
};

export default ValueUpsertDialog;
