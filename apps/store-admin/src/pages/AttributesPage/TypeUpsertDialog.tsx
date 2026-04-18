import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Dialog, Flex, Button, StringInput, Toggle } from '@baby-toys/ui-kit';

import { useToast } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { useLocales } from '../../hooks/useLocales';
import {
  useAttributeTypeAdmin,
  useCreateAttributeType,
  useUpdateAttributeType,
} from '../../api/attributeApi';

type TranslationForm = {
  displayName?: string;
  description?: string;
};

type FormValues = {
  code: string;
  isFilterable?: boolean;
  isMultiselect?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  translations: Record<string, TranslationForm>;
};

export type TypeUpsertDialogProps = {
  mode: 'create' | 'edit';
  visible: boolean;
  onClose: () => void;
  typeId?: number;
  onSuccess?: () => void;
};

const TypeUpsertDialog: React.FC<TypeUpsertDialogProps> = ({
  mode,
  visible,
  onClose,
  typeId,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const isEdit = mode === 'edit';

  const locales = useLocales();

  const { data: typeAdmin } = useAttributeTypeAdmin(isEdit ? typeId : undefined);

  // ✅ enforce non-empty record keys
  const schema = useMemo(
    () =>
      z.object({
        code: z.string().optional().default(''),
        isFilterable: z.boolean().optional().default(false),
        isMultiselect: z.boolean().optional().default(false),
        isActive: z.boolean().optional().default(true),
        sortOrder: z.coerce.number().int().nonnegative().optional().default(0),
        translations: z.record(
          z.string().min(1), // <--- key must be non-empty
          z.object({
            displayName: z.string().min(1, 'Required'),
            description: z.string().default(''),
          })
        ),
      }),
    []
  );

  const rhf = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', translations: {} },
    mode: 'onChange',
    criteriaMode: 'all',
  });

  useEffect(() => {
    if (!visible) return;

    const src: any = typeAdmin || {};
    const trList = (src?.translations || []) as Array<{
      locale: string;
      displayName?: string;
      description?: string;
    }>;
    const normalize = (x: any) => String(x ?? '').toLowerCase();

    const defaults: FormValues = {
      code: src?.code ?? '',
      isFilterable: src?.isFilterable ?? false,
      isMultiselect: src?.isMultiselect ?? false,
      isActive: src?.isActive ?? true,
      sortOrder: src?.sortOrder ?? 0,
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
  }, [visible, typeAdmin, locales, rhf]);

  const createMutation = useCreateAttributeType();
  const updateMutation = useUpdateAttributeType();

  const onSubmit = async (values: FormValues) => {
    const code = String(values.code ?? '').trim();

    const translations = Object.entries(values.translations || {})
      .map(([locale, tr]) => {
        const cleanLocale = String(locale ?? '').trim();
        if (!cleanLocale) return null;

        const displayName = String(tr?.displayName ?? '').trim();
        const description = String(tr?.description ?? '').trim();
        if (!displayName && !description) return null;

        return {
          locale: cleanLocale,
          displayName: displayName || undefined,
          description: description || undefined,
        };
      })
      .filter(Boolean) as Array<{ locale: string; displayName?: string; description?: string }>;

    const payload: any = {
      isFilterable: !!values.isFilterable,
      isMultiselect: !!values.isMultiselect,
      isActive: !!values.isActive,
      sortOrder: values.sortOrder ?? 0,
      translations: translations.length ? translations : undefined,
    };
    if (code) payload.code = code;

    try {
      if (!isEdit) {
        await createMutation.mutateAsync(payload);
        toast.success(t('common.create', { defaultValue: 'Create' }));
      } else if (typeId) {
        await updateMutation.mutateAsync({ id: typeId, payload });
        toast.success(t('common.update', { defaultValue: 'Update' }));
      }

      onSuccess?.();
      onClose();
    } catch (e: any) {
      toast.error(e?.message || t('app.unexpectedError'));
    }
  };

  const onInvalid = (_errors: any) => {
    toast.error(t('app.formInvalid', { defaultValue: 'Please fix the highlighted fields.' }));
  };

  const ToggleFieldAdapter: React.FC<{
    value?: boolean;
    onChange?: (v: boolean) => void;
    isDisabled?: boolean;
  }> = ({ value, onChange, isDisabled }) => (
    <Toggle checked={!!value} onChange={(v) => onChange?.(!!v)} isDisabled={isDisabled} />
  );

  const headerText = !isEdit
    ? t('attributes.addType', { defaultValue: 'Add Attribute' })
    : t('common.edit', { defaultValue: 'Edit' });

  return (
    <Dialog header={headerText} visible={visible} onHide={onClose} dismissibleMask modal>
      <form onSubmit={rhf.handleSubmit(onSubmit, onInvalid)}>
        <Flex direction="vertical" spacing="m">
          {locales.map((loc) => (
            <Flex key={loc} spacing="l" wrap>
              <FormFieldWrapper
                name={`translations.${loc}.displayName`}
                control={rhf.control}
                label={`${t('attributes.name', { defaultValue: 'Name' })} (${loc.toUpperCase()})`}
                required
                rules={{ required: t('common.required', { defaultValue: 'Required' }) }}
              >
                <StringInput isDisabled={rhf.formState.isSubmitting} />
              </FormFieldWrapper>

              <FormFieldWrapper
                name={`translations.${loc}.description`}
                control={rhf.control}
                label={`${t('attributes.description', { defaultValue: 'Description' })} (${loc.toUpperCase()})`}
              >
                <StringInput isDisabled={rhf.formState.isSubmitting} />
              </FormFieldWrapper>
            </Flex>
          ))}

          <Flex spacing="l" wrap>
            <FormFieldWrapper
              name="isFilterable"
              control={rhf.control}
              label={t('attributes.filterable', { defaultValue: 'Filterable' })}
            >
              <ToggleFieldAdapter isDisabled={rhf.formState.isSubmitting} />
            </FormFieldWrapper>

            <FormFieldWrapper
              name="isMultiselect"
              control={rhf.control}
              label={t('attributes.multi', { defaultValue: 'Multi-select' })}
            >
              <ToggleFieldAdapter isDisabled={rhf.formState.isSubmitting} />
            </FormFieldWrapper>

            <FormFieldWrapper
              name="isActive"
              control={rhf.control}
              label={t('attributes.active', { defaultValue: 'Active' })}
            >
              <ToggleFieldAdapter isDisabled={rhf.formState.isSubmitting} />
            </FormFieldWrapper>

            <FormFieldWrapper
              name="sortOrder"
              control={rhf.control}
              label={t('attributes.sortOrder', { defaultValue: 'Sort Order' })}
            >
              <StringInput type="number" isDisabled={rhf.formState.isSubmitting} />
            </FormFieldWrapper>
          </Flex>
          <FormFieldWrapper
            name="code"
            control={rhf.control}
            label={t('attributes.code', { defaultValue: 'Code' })}
            fullWidth
          >
            <StringInput
              placeholder={t('attributes.code', { defaultValue: 'Code' })}
              isDisabled={rhf.formState.isSubmitting}
            />
          </FormFieldWrapper>

          <Flex justify="end" spacing="s">
            <Button appearance="outline" type="button" onClick={onClose}>
              {t('app.cancel', { defaultValue: 'Cancel' })}
            </Button>

            <Button
              type="submit"
              isLoading={isEdit ? updateMutation.isPending : createMutation.isPending}
              isDisabled={isEdit ? updateMutation.isPending : createMutation.isPending}
            >
              {isEdit
                ? t('common.update', { defaultValue: 'Update' })
                : t('app.save', { defaultValue: 'Save' })}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Dialog>
  );
};

export default TypeUpsertDialog;
