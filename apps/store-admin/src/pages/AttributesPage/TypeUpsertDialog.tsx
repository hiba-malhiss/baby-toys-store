import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Dialog, Flex, Button, StringInput, Toggle } from '@baby-toys/ui-kit';
import { useCreateAttributeType, useUpdateAttributeType } from '../../api/attributeApi';
import type { AttributeType } from '../../api/types/attribute';
import { useToast } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';

const schema = z.object({
  code: z.string().min(1),
  isFilterable: z.boolean().optional().default(false),
  isMultiselect: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().nonnegative().optional().default(0),
  nameEn: z.string().optional().default(''),
  descEn: z.string().optional().default(''),
  nameAr: z.string().optional().default(''),
  descAr: z.string().optional().default(''),
});

export type TypeUpsertDialogProps = {
  mode: 'create' | 'edit';
  visible: boolean;
  onClose: () => void;
  initial?: AttributeType | null;
  onSuccess?: () => void;
};

const TypeUpsertDialog: React.FC<TypeUpsertDialogProps> = ({
  mode,
  visible,
  onClose,
  initial,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  const defaultValues = React.useMemo(() => {
    const tr = initial?.translations || [];
    const en = tr.find((x: any) => (x?.locale || '').toLowerCase() === 'en');
    const ar = tr.find((x: any) => (x?.locale || '').toLowerCase() === 'ar');
    return {
      code: initial?.code ?? '',
      isFilterable: initial?.isFilterable ?? false,
      isMultiselect: initial?.isMultiselect ?? false,
      isActive: initial?.isActive ?? true,
      sortOrder: initial?.sortOrder ?? 0,
      nameEn: en?.displayName ?? '',
      descEn: en?.description ?? '',
      nameAr: ar?.displayName ?? '',
      descAr: ar?.description ?? '',
    };
  }, [initial]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const createMutation = useCreateAttributeType();
  const updateMutation = useUpdateAttributeType(initial?.id || 0);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const translations = [] as Array<{
      locale: string;
      displayName?: string | null;
      description?: string | null;
    }>;
    if (values.nameEn?.trim() || values.descEn?.trim()) {
      translations.push({
        locale: 'en',
        displayName: values.nameEn.trim() || undefined,
        description: values.descEn.trim() || undefined,
      });
    }
    if (values.nameAr?.trim() || values.descAr?.trim()) {
      translations.push({
        locale: 'ar',
        displayName: values.nameAr.trim() || undefined,
        description: values.descAr.trim() || undefined,
      });
    }

    const payload = {
      code: values.code.trim(),
      isFilterable: !!values.isFilterable,
      isMultiselect: !!values.isMultiselect,
      isActive: !!values.isActive,
      sortOrder: values.sortOrder ?? 0,
      translations: translations.length ? translations : undefined,
    } as any;

    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(payload);
        toast.success(t('common.create', { defaultValue: 'Create' }));
      } else {
        await updateMutation.mutateAsync(payload);
        toast.success(t('common.update', { defaultValue: 'Update' }));
      }
      onSuccess?.();
      onClose();
    } catch (e: any) {
      toast.error(e?.message || t('app.unexpectedError'));
    }
  };

  const ToggleFieldAdapter: React.FC<{
    value?: boolean;
    onChange?: (v: boolean) => void;
    isDisabled?: boolean;
  }> = ({ value, onChange, isDisabled }) => (
    <Toggle checked={!!value} onChange={(v) => onChange?.(!!v)} isDisabled={isDisabled} />
  );

  return (
    <Dialog
      header={
        mode === 'create'
          ? t('attributes.addType', { defaultValue: 'Add Attribute' })
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
          <StringInput
            placeholder={t('attributes.code', { defaultValue: 'Code' })}
            isDisabled={isSubmitting}
          />
        </FormFieldWrapper>

        <Flex spacing="l" wrap>
          <FormFieldWrapper
            name="nameEn"
            control={control}
            label={t('attributes.nameEn', { defaultValue: 'Name (EN)' })}
          >
            <StringInput isDisabled={isSubmitting} />
          </FormFieldWrapper>
          <FormFieldWrapper
            name="descEn"
            control={control}
            label={t('attributes.descEn', { defaultValue: 'Description (EN)' })}
          >
            <StringInput isDisabled={isSubmitting} />
          </FormFieldWrapper>
        </Flex>

        <Flex spacing="l" wrap>
          <FormFieldWrapper
            name="nameAr"
            control={control}
            label={t('attributes.nameAr', { defaultValue: 'Name (AR)' })}
          >
            <StringInput isDisabled={isSubmitting} />
          </FormFieldWrapper>
          <FormFieldWrapper
            name="descAr"
            control={control}
            label={t('attributes.descAr', { defaultValue: 'Description (AR)' })}
          >
            <StringInput isDisabled={isSubmitting} />
          </FormFieldWrapper>
        </Flex>

        <Flex spacing="l" wrap>
          <FormFieldWrapper
            name="isFilterable"
            control={control}
            label={t('attributes.filterable', { defaultValue: 'Filterable' })}
          >
            <ToggleFieldAdapter isDisabled={isSubmitting} />
          </FormFieldWrapper>
          <FormFieldWrapper
            name="isMultiselect"
            control={control}
            label={t('attributes.multi', { defaultValue: 'Multi-select' })}
          >
            <ToggleFieldAdapter isDisabled={isSubmitting} />
          </FormFieldWrapper>
          <FormFieldWrapper
            name="isActive"
            control={control}
            label={t('attributes.active', { defaultValue: 'Active' })}
          >
            <ToggleFieldAdapter isDisabled={isSubmitting} />
          </FormFieldWrapper>
          <FormFieldWrapper
            name="sortOrder"
            control={control}
            label={t('attributes.sortOrder', { defaultValue: 'Sort Order' })}
          >
            <StringInput type="number" isDisabled={isSubmitting} />
          </FormFieldWrapper>
        </Flex>
      </Flex>
    </Dialog>
  );
};

export default TypeUpsertDialog;
