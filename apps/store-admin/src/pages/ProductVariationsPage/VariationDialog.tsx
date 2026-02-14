import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  Flex,
  StringInput,
  Toggle,
  Select,
  Option,
  FieldWrapper,
  useToast,
  Image,
  Divider,
} from '@baby-toys/ui-kit';

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
  barcode: string;
  price: string;
  oldPrice: string;
  costPrice: string;
  stock: string;
  active: boolean;
  mainImage?: string;
  images: string[];
  selections: Record<number, number>;
};

type FormErrors = {
  sku?: string;
  price?: string;
  costPrice?: string;
  oldPrice?: string;
  options?: Record<number, string>;
};

const DEFAULT_FORM: FormState = {
  sku: '',
  barcode: '',
  price: '',
  oldPrice: '',
  costPrice: '',
  stock: '0',
  active: true,
  mainImage: undefined,
  images: [],
  selections: {},
};

const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

const VariationDialog: React.FC<Props> = ({
  productId,
  isOpen,
  onClose,
  productOptions,
  editing,
  productMainImage,
  productImages,
}) => {
  const toast = useToast();

  const createVariant = useCreateVariant(productId);
  const updateVariant = useUpdateVariant(productId);

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOpen) return;

    if (editing) {
      setForm({
        sku: editing.sku || '',
        barcode: String(editing.barcode ?? ''),
        price: String(editing.price ?? ''),
        oldPrice: String(editing.oldPrice ?? ''),
        costPrice: String(editing.costPrice ?? ''),
        stock: String(editing.stockQuantity ?? '0'),
        active: !!editing.isActive,
        mainImage: editing.mainImage ?? undefined,
        images: editing.images || [],
        selections: Object.fromEntries(
          Object.entries(editing.optionSelectionIds || {}).map(([k, v]) => [Number(k), Number(v)])
        ),
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [editing, isOpen]);

  const mustSelectAll = productOptions.length > 0;

  const allProductImages = useMemo(() => {
    return uniq([...(productMainImage ? [productMainImage] : []), ...(productImages || [])]);
  }, [productMainImage, productImages]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    console.log(form);
    const priceNum = Number(form.price);
    const costNum = form.costPrice ? Number(form.costPrice) : undefined;
    const oldPriceNum = form.oldPrice ? Number(form.oldPrice) : undefined;

    if (!form.sku.trim()) next.sku = 'SKU is required';
    if (!form.price) next.price = 'Price is required';
    else if (!Number.isFinite(priceNum)) next.price = 'Price must be a number';
    else if (priceNum < 0) next.price = 'Price cannot be negative';

    if (typeof costNum === 'number') {
      if (!Number.isFinite(costNum)) next.costPrice = 'Cost price must be a number';
      else if (costNum < 0) next.costPrice = 'Cost price cannot be negative';
      else if (costNum > priceNum) next.costPrice = 'Cost price cannot exceed price';
    }

    if (typeof oldPriceNum === 'number') {
      if (!Number.isFinite(oldPriceNum)) next.oldPrice = 'Old price must be a number';
      else if (oldPriceNum < 0) next.oldPrice = 'Old price cannot be negative';
      else if (oldPriceNum < priceNum)
        next.oldPrice = 'Old price must be greater than or equal to price';
    }

    if (mustSelectAll) {
      const optionErrors: Record<number, string> = {};
      productOptions.forEach((option) => {
        const val = form.selections[option.type.id];
        if (val === undefined || val === null) {
          optionErrors[option.type.id] = `Please select ${option.type.name}`;
        }
      });
      if (Object.keys(optionErrors).length) next.options = optionErrors;
    }

    setErrors(next);

    if (Object.keys(next).length > 0) return false;

    return productOptions.every(
      (option) =>
        form.selections[option.type.id] !== undefined && form.selections[option.type.id] !== null
    );
  };

  const buildPayload = (): CreateVariantRequest | UpdateVariantRequest => {
    const priceNum = Number(form.price);
    const stockNum = Number(form.stock);
    const costNum = form.costPrice ? Number(form.costPrice) : undefined;
    const oldPriceNum = form.oldPrice ? Number(form.oldPrice) : undefined;

    return {
      sku: form.sku.trim(),
      barcode: form.barcode ? form.barcode.trim() : undefined,
      price: priceNum,
      oldPrice: oldPriceNum,
      costPrice: costNum,
      stockQuantity: Number.isNaN(stockNum) ? 0 : stockNum,
      isActive: form.active,
      mainImage: form.mainImage ?? null,
      images: form.images,
      optionSelections: mustSelectAll ? form.selections : {},
    };
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      const payload = buildPayload();
      if (editing) {
        await updateVariant.mutateAsync({ variantId: editing.id, payload });
        toast.success('Variation updated');
      } else {
        await createVariant.mutateAsync(payload as CreateVariantRequest);
        toast.success('Variation created');
      }
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Dialog
      header={editing ? 'Edit Variation' : 'Add Variation'}
      visible={isOpen}
      width="60%"
      onVisibleChange={(v) => {
        if (!v) onClose();
      }}
    >
      <Flex spacing="m" wrap>
        <FieldWrapper label="SKU" error={errors.sku} required>
          <StringInput
            placeholder="SKU"
            value={form.sku}
            onChange={(v) => {
              const val = String(v ?? '');
              setField('sku', val);
              if (val.trim()) setErrors((e) => ({ ...e, sku: undefined }));
            }}
          />
        </FieldWrapper>

        <FieldWrapper label="Barcode">
          <StringInput
            placeholder="Barcode"
            value={form.barcode}
            onChange={(v) => setField('barcode', String(v ?? ''))}
          />
        </FieldWrapper>

        <FieldWrapper label="Price" error={errors.price} required>
          <StringInput
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(v) => {
              const val = String(v ?? '');
              setField('price', val);
              setErrors((e) => ({
                ...e,
                price: undefined,
                oldPrice: undefined,
                costPrice: undefined,
              }));
            }}
          />
        </FieldWrapper>

        <FieldWrapper label="Old Price" error={errors.oldPrice}>
          <StringInput
            placeholder="Old Price"
            type="number"
            value={form.oldPrice}
            onChange={(v) => {
              const val = String(v ?? '');
              setField('oldPrice', val);
              setErrors((e) => ({ ...e, oldPrice: undefined }));
            }}
          />
        </FieldWrapper>

        <FieldWrapper label="Cost Price" error={errors.costPrice}>
          <StringInput
            placeholder="Cost Price"
            type="number"
            value={form.costPrice}
            onChange={(v) => {
              const val = String(v ?? '');
              setField('costPrice', val);
              setErrors((e) => ({ ...e, costPrice: undefined }));
            }}
          />
        </FieldWrapper>

        <FieldWrapper label="Stock">
          <StringInput
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(v) => setField('stock', String(v ?? ''))}
          />
        </FieldWrapper>

        <FieldWrapper label="Active">
          <Toggle value={form.active} onChange={(val) => setField('active', !!val)} />
        </FieldWrapper>
      </Flex>

      <Divider className="bts-marginVm" />

      <Flex direction="vertical" spacing="s" fullWidth>
        <FieldWrapper label="Main Image" fullWidth>
          <Select
            placeholder="Select main image"
            value={form.mainImage}
            onChange={(v) => setField('mainImage', (v as string) || undefined)}
          >
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
        </FieldWrapper>

        <FieldWrapper label="Gallery Images" fullWidth>
          <Select
            multiple
            placeholder="Select images"
            value={form.images}
            onChange={(vals) =>
              setField('images', (Array.isArray(vals) ? vals : [vals]).filter(Boolean) as string[])
            }
          >
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
        </FieldWrapper>
      </Flex>

      <Divider className="bts-marginVm" />

      {productOptions.length > 0 && (
        <Flex direction="vertical" spacing="s" fullWidth>
          {productOptions.map((opt) => {
            const optionError = errors.options?.[opt.type.id];
            return (
              <FieldWrapper
                required
                key={opt.type.id}
                label={opt.type.name}
                error={optionError}
                fullWidth
              >
                <Select
                  placeholder={`Select ${opt.type.name}`}
                  value={form.selections[opt.type.id]}
                  onChange={(v) => {
                    setForm((prev) => ({
                      ...prev,
                      selections: { ...prev.selections, [opt.type.id]: Number(v) },
                    }));
                    if (errors.options?.[opt.type.id]) {
                      setErrors((prev) => ({
                        ...prev,
                        options: { ...prev.options, [opt.type.id]: undefined },
                      }));
                    }
                  }}
                  fullWidth
                  status={optionError ? 'error' : 'default'}
                >
                  <Option value={undefined} disabled>
                    Select {opt.type.name}
                  </Option>
                  {opt.values.map((val) => (
                    <Option key={val.id} value={val.id}>
                      {val.value}
                    </Option>
                  ))}
                </Select>
              </FieldWrapper>
            );
          })}
        </Flex>
      )}

      <Flex justify="end" spacing="m" className="bts-marginTm">
        <Button appearance="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit} isLoading={createVariant.isPending || updateVariant.isPending}>
          {editing ? 'Save' : 'Create'}
        </Button>
      </Flex>
    </Dialog>
  );
};

export default VariationDialog;
