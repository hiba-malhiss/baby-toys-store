import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  Flex,
  StringInput,
  Toggle,
  Select,
  Option,
  useToast,
  Divider,
  ImagePickerModal,
} from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateVariant, useUpdateVariant } from '../../api/variantApi';

import type {
  VariantDto,
  CreateVariantRequest,
  UpdateVariantRequest,
} from '../../api/types/variant';
import type { ProductOptionDto } from '../../api/types/product';

type Props = {
  productId: number;
  isOpen: boolean;
  onClose: () => void;
  productOptions: ProductOptionDto[];
  editing?: VariantDto | null;
  productMainImage?: string | null;
  productImages?: string[];
};

type FormState = {
  sku: string;
  price: string;
  oldPrice: string;
  costPrice: string;
  stock: string;
  active: boolean;
  mainImage?: string;
  selections: Record<string, string>;
};

const DEFAULT_FORM: FormState = {
  sku: '',
  price: '',
  oldPrice: '',
  costPrice: '',
  stock: '0',
  active: true,
  mainImage: undefined,
  selections: {},
};

const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

const buildVariationSchema = (optionTypeIds: number[], t: any) =>
  z
    .object({
      sku: z.string().optional().or(z.literal('')),
      price: z.preprocess(
        (v) => {
          const s = typeof v === 'string' ? v.trim() : v;
          if (s === '' || s === undefined || s === null) return undefined;
          const n = Number(s as any);
          return Number.isFinite(n) ? n : NaN;
        },
        z
          .number({ message: t('validation.required', { field: t('app.variation.price') }) })
          .nonnegative({
            message: t('validation.nonNegative', { field: t('app.variation.price') }),
          })
      ),
      oldPrice: z.preprocess(
        (v) => {
          const s = typeof v === 'string' ? v.trim() : v;
          if (s === '' || s === undefined || s === null) return undefined;
          const n = Number(s as any);
          return Number.isFinite(n) ? n : NaN;
        },
        z
          .number()
          .nonnegative({
            message: t('validation.nonNegative', { field: t('app.variation.oldPrice') }),
          })
          .optional()
      ),

      // costPrice: required number, non-negative
      costPrice: z.preprocess(
        (v) => {
          const s = typeof v === 'string' ? v.trim() : v;
          if (s === '' || s === undefined || s === null) return undefined;
          const n = Number(s as any);
          return Number.isFinite(n) ? n : NaN;
        },
        z
          .number({ message: t('validation.required', { field: t('app.variation.costPrice') }) })
          .nonnegative({
            message: t('validation.nonNegative', { field: t('app.variation.costPrice') }),
          })
      ),
      stock: z.preprocess(
        (v) => {
          const s = typeof v === 'string' ? v.trim() : v;
          if (s === '' || s === undefined || s === null) return undefined;
          const n = Number(s as any);
          return Number.isFinite(n) ? n : NaN;
        },
        z
          .number({ message: t('validation.required', { field: t('app.variation.stock') }) })
          .int({ message: t('validation.number', { field: t('app.variation.stock') }) })
          .gt(0, {
            message: t('validation.mustBeGreaterThanZero', { field: t('app.variation.stock') }),
          })
      ),

      active: z.boolean(),
      mainImage: z
        .string()
        .min(1, t('validation.required', { field: t('app.variation.mainImage') })),
      selections: z.record(z.string(), z.string()).optional().default({}),
    })
    .superRefine((data, ctx) => {
      const priceNum = data.price as unknown as number;
      const costNum = (data.costPrice as unknown as number) ?? 0;
      const oldPriceNum = (data.oldPrice as unknown as number) ?? 0;

      if (Number.isFinite(priceNum) && Number.isFinite(costNum) && costNum > priceNum) {
        ctx.addIssue({
          path: ['costPrice'],
          code: z.ZodIssueCode.custom,
          message: t('app.variation.errors.costExceedsPrice'),
        });
      }

      if (
        data.oldPrice !== undefined &&
        Number.isFinite(oldPriceNum) &&
        Number.isFinite(priceNum) &&
        oldPriceNum < priceNum
      ) {
        ctx.addIssue({
          path: ['oldPrice'],
          code: z.ZodIssueCode.custom,
          message: t('app.variation.errors.oldPriceBelowPrice'),
        });
      }

      // If product has options, require selection for each option type
      if (optionTypeIds && optionTypeIds.length > 0) {
        const sel = (data.selections || {}) as Record<string | number, unknown>;
        optionTypeIds.forEach((id) => {
          const v = sel[id] ?? sel[String(id)];
          const missing = v === undefined || v === null || v === '';
          if (missing) {
            ctx.addIssue({
              path: ['selections', String(id)],
              code: z.ZodIssueCode.custom,
              message: t('app.variation.errors.selectOption', {
                defaultValue: 'Please select an option value.',
              }),
            });
          }
        });
      }
    });

const VariationDialog: React.FC<Props> = ({
  productId,
  isOpen,
  onClose,
  productOptions,
  editing,
  productMainImage,
  productImages,
}) => {
  const { t } = useTranslation('common');
  const toast = useToast();

  const createVariant = useCreateVariant(productId);
  const updateVariant = useUpdateVariant(productId);

  const schema = buildVariationSchema(
    productOptions.map((o) => o.type.id),
    t
  );
  const { control, handleSubmit, reset, watch, setValue } = useForm<FormState>({
    defaultValues: DEFAULT_FORM,
    resolver: zodResolver(schema),
  });

  const allProductImages = useMemo(
    () => uniq([...(productMainImage ? [productMainImage] : []), ...(productImages || [])]),
    [productMainImage, productImages]
  );

  const selectedMainImage = watch('mainImage');

  useEffect(() => {
    if (!isOpen) return;
    if (editing) {
      reset({
        sku: editing.sku || '',
        price: String(editing.price ?? ''),
        oldPrice: String(editing.oldPrice ?? ''),
        costPrice: String(editing.costPrice ?? ''),
        stock: String(editing.stockQuantity ?? '0'),
        active: !!editing.isActive,
        mainImage: editing.mainImage ?? undefined,
        selections: Object.fromEntries(
          Object.entries(editing.optionSelectionIds || {}).map(([k, v]) => [String(k), String(v)])
        ),
      });
    } else reset(DEFAULT_FORM);
  }, [editing, isOpen, reset]);

  const onSubmit = async (data: FormState) => {
    const payload: CreateVariantRequest | UpdateVariantRequest = {
      // Omit SKU when empty to let backend generate a default
      sku: data.sku && data.sku.trim() ? data.sku.trim() : undefined,
      price: Number(data.price),
      oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined,
      costPrice: data.costPrice ? Number(data.costPrice) : undefined,
      stockQuantity: Number(data.stock) || 0,
      isActive: data.active,
      mainImage: data.mainImage ?? null,
      optionSelections: productOptions.length
        ? Object.fromEntries(
            Object.entries(data.selections || {}).map(([k, v]) => [Number(k), Number(v)])
          )
        : {},
    };

    try {
      if (editing) {
        await updateVariant.mutateAsync({ variantId: editing.id, payload });
        toast.success(t('app.variation.updateSuccess'));
      } else {
        await createVariant.mutateAsync(payload as CreateVariantRequest);
        toast.success(t('app.variation.createSuccess'));
      }
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t('app.unexpectedError'));
    }
  };

  const onInvalid = () => {
    toast.error(t('app.formInvalid', { defaultValue: 'Please fix the highlighted fields.' }));
  };

  return (
    <Dialog
      header={editing ? t('app.variation.editTitle') : t('app.variation.addTitle')}
      visible={isOpen}
      width="60%"
      onVisibleChange={(v) => !v && onClose()}
    >
      <Flex spacing="m" wrap>
        <FormFieldWrapper name="sku" control={control} label={t('app.variation.sku')}>
          <StringInput placeholder={t('app.variation.sku')} />
        </FormFieldWrapper>

        <FormFieldWrapper name="price" control={control} label={t('app.variation.price')} required>
          <StringInput placeholder={t('app.variation.price')} type="number" />
        </FormFieldWrapper>

        <FormFieldWrapper name="oldPrice" control={control} label={t('app.variation.oldPrice')}>
          <StringInput placeholder={t('app.variation.oldPrice')} type="number" />
        </FormFieldWrapper>

        <FormFieldWrapper
          name="costPrice"
          control={control}
          label={t('app.variation.costPrice')}
          required
        >
          <StringInput placeholder={t('app.variation.costPrice')} type="number" />
        </FormFieldWrapper>

        <FormFieldWrapper name="stock" control={control} label={t('app.variation.stock')} required>
          <StringInput placeholder={t('app.variation.stock')} type="number" />
        </FormFieldWrapper>

        <FormFieldWrapper name="active" control={control} label={t('app.variation.active')}>
          <Toggle />
        </FormFieldWrapper>
      </Flex>

      <Divider className="bts-marginVm" />

      {/* Image picker */}
      <ImagePickerModal
        images={allProductImages}
        value={selectedMainImage}
        onChange={(url) => {
          setValue('mainImage', url, { shouldValidate: true });
        }}
        label={t('app.variation.mainImage')}
        placeholder={t('app.variation.selectImage', { defaultValue: 'Select Image' })}
        title={t('app.variation.selectVariationImage', {
          defaultValue: 'Select Variation Image',
        })}
        hint={
          allProductImages.length === 0
            ? t('app.variation.noImagesHint', {
                defaultValue: 'No product images available. Add images to the product first.',
              })
            : undefined
        }
        disabled={allProductImages.length === 0}
        status="default"
      />

      {productOptions.length > 0 && (
        <>
          <Divider className="bts-marginVm" />
          <Flex direction="vertical" spacing="s" fullWidth>
            {productOptions.map((opt) => (
              <FormFieldWrapper
                key={opt.type.id}
                name={`selections.${opt.type.id}`}
                control={control}
                label={opt.type.translations?.[0]?.displayName || ''}
                required
                fullWidth
              >
                <Select>
                  <Option value="" disabled>
                    {t('app.variation.selectPlaceholder', {
                      option: opt.type.translations?.[0]?.displayName,
                    })}
                  </Option>
                  {opt.values.map((val) => (
                    <Option key={val.id} value={String(val.id)}>
                      {val.translations?.[0]?.display}
                    </Option>
                  ))}
                </Select>
              </FormFieldWrapper>
            ))}
          </Flex>
        </>
      )}

      <Flex justify="end" spacing="m" className="bts-marginTm">
        <Button appearance="outline" onClick={onClose}>
          {t('app.variation.cancel')}
        </Button>
        <Button
          onClick={handleSubmit(onSubmit, onInvalid)}
          isLoading={createVariant.isPending || updateVariant.isPending}
        >
          {editing ? t('app.variation.save') : t('app.variation.create')}
        </Button>
      </Flex>
    </Dialog>
  );
};

export default VariationDialog;
