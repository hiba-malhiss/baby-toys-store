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
  Image,
  Divider,
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
  selections: Record<number, number>;
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

const buildVariationSchema = (productOptions: { type: { id: number; name?: string } }[], t: any) =>
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
          .nonnegative({ message: t('validation.nonNegative', { field: t('app.variation.price') }) })
      ),
      oldPrice: z
        .preprocess((v) => {
          const s = typeof v === 'string' ? v.trim() : v;
          if (s === '' || s === undefined || s === null) return undefined;
          const n = Number(s as any);
          return Number.isFinite(n) ? n : NaN;
        }, z.number().nonnegative({ message: t('validation.nonNegative', { field: t('app.variation.oldPrice') }) }).optional()),

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
          .nonnegative({ message: t('validation.nonNegative', { field: t('app.variation.costPrice') }) })
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
          .gt(0, { message: t('validation.mustBeGreaterThanZero', { field: t('app.variation.stock') }) })
      ),

      active: z.boolean(),
      mainImage: z.string().min(1, t('validation.required', { field: t('app.variation.mainImage') })),
      selections: z.record(z.number()).optional().default({}),
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

      if (data.oldPrice !== undefined && Number.isFinite(oldPriceNum) && Number.isFinite(priceNum) && oldPriceNum < priceNum) {
        ctx.addIssue({
          path: ['oldPrice'],
          code: z.ZodIssueCode.custom,
          message: t('app.variation.errors.oldPriceBelowPrice'),
        });
      }

      productOptions.forEach((opt) => {
        if ((data.selections || {})[opt.type.id] === undefined) {
          ctx.addIssue({
            path: ['selections', String(opt.type.id)],
            code: z.ZodIssueCode.custom,
            message: t('app.variation.errors.selectOption', {
              option: String(opt.type.name || '').toLowerCase(),
            }),
          });
        }
      });
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

  const schema = buildVariationSchema(productOptions, t);
  const { control, handleSubmit, reset, watch } = useForm<FormState>({
    defaultValues: DEFAULT_FORM,
    resolver: zodResolver(schema),
  });

  const allProductImages = useMemo(
    () => uniq([...(productMainImage ? [productMainImage] : []), ...(productImages || [])]),
    [productMainImage, productImages]
  );

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
          Object.entries(editing.optionSelectionIds || {}).map(([k, v]) => [Number(k), Number(v)])
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
      optionSelections: productOptions.length ? data.selections : {},
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

      <FormFieldWrapper
        name="mainImage"
        control={control}
        label={t('app.variation.mainImage')}
        required
        fullWidth
      >
        <Select>
          {allProductImages.map((img) => (
            <Option key={img} value={img}>
              <Flex align="center" spacing="m">
                <Image
                  src={img}
                  alt="img"
                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                />
                <span>{img}</span>
              </Flex>
            </Option>
          ))}
        </Select>
      </FormFieldWrapper>

      {productOptions.length > 0 && (
        <>
          <Divider className="bts-marginVm" />
          <Flex direction="vertical" spacing="s" fullWidth>
            {productOptions.map((opt) => (
              <FormFieldWrapper
                key={opt.type.id}
                name={`selections.${opt.type.id}`}
                control={control}
                label={opt.type.name || ''}
                required
                fullWidth
              >
                <Select>
                  <Option value={undefined} disabled>
                    {t('app.variation.selectPlaceholder', { option: opt.type.name })}
                  </Option>
                  {opt.values.map((val) => (
                    <Option key={val.id} value={val.id}>
                      {val.value}
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
