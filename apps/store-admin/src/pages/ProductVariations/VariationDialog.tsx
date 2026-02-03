import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  Flex,
  StringInput,
  Toggle,
  Select,
  Option,
  Text,
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
  existingVariants: VariantDto[];
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
  existingVariants,
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
  const hasAllSelections =
    !mustSelectAll || productOptions.every((t) => form.selections[t.type.id]);

  const allProductImages = useMemo(() => {
    return uniq([...(productMainImage ? [productMainImage] : []), ...(productImages || [])]);
  }, [productMainImage, productImages]);

  const keyOfSelections = (sel: Record<number, number>) =>
    Object.entries(sel)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([t, v]) => `${t}:${v}`)
      .join('|');

  const existingKeys = useMemo(() => {
    const set = new Set<string>();
    for (const v of existingVariants) {
      const sel = Object.fromEntries(
        Object.entries(v.optionSelectionIds || {}).map(([k, val]) => [Number(k), Number(val)])
      );
      set.add(keyOfSelections(sel));
    }
    return set;
  }, [existingVariants]);

  const currentKey = keyOfSelections(form.selections);

  const isDuplicate = useMemo(() => {
    if (!hasAllSelections) return false;

    if (editing) {
      const originalKey = keyOfSelections(
        Object.fromEntries(
          Object.entries(editing.optionSelectionIds || {}).map(([k, v]) => [Number(k), Number(v)])
        )
      );
      if (originalKey === currentKey) return false;
    }

    return existingKeys.has(currentKey);
  }, [editing, existingKeys, currentKey, hasAllSelections]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const priceNum = Number(form.price);
    const costNum = form.costPrice ? Number(form.costPrice) : undefined;
    const oldPriceNum = form.oldPrice ? Number(form.oldPrice) : undefined;

    const next: FormErrors = {};

    if (!form.sku.trim()) next.sku = 'SKU is required';

    if (form.price === '') next.price = 'Price is required';
    else if (!Number.isFinite(priceNum)) next.price = 'Price must be a number';
    else if (priceNum < 0) next.price = 'Price cannot be negative';

    if (typeof costNum === 'number') {
      if (!Number.isFinite(costNum)) next.costPrice = 'Cost price must be a number';
      else if (costNum < 0) next.costPrice = 'Cost price cannot be negative';
      else if (Number.isFinite(priceNum) && costNum > priceNum)
        next.costPrice = 'Cost price cannot exceed price';
    }

    if (typeof oldPriceNum === 'number') {
      if (!Number.isFinite(oldPriceNum)) next.oldPrice = 'Old price must be a number';
      else if (oldPriceNum < 0) next.oldPrice = 'Old price cannot be negative';
      else if (Number.isFinite(priceNum) && oldPriceNum < priceNum)
        next.oldPrice = 'Old price must be greater than or equal to price';
    }

    if (mustSelectAll && !hasAllSelections) {
      toast.error('Please select one value for each option type.');
    }

    if (isDuplicate) {
      toast.error('A variation with the same option combination already exists.');
    }

    setErrors(next);

    const hasErrors = Object.keys(next).length > 0;
    if (hasErrors) return false;
    if (mustSelectAll && !hasAllSelections) return false;
    if (isDuplicate) return false;

    return true;
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
      onVisibleChange={(v: boolean) => {
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
      <Divider className="bts-marginVm"></Divider>
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
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
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
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                  />
                  <span>{img}</span>
                </Flex>
              </Option>
            ))}
          </Select>
        </FieldWrapper>
      </Flex>
      <Divider className="bts-marginVm"></Divider>
      {productOptions.length > 0 && (
        <Flex direction="vertical" spacing="s" fullWidth>
          {productOptions.map((opt) => (
            <FieldWrapper key={opt.type.id} label={opt.type.name} fullWidth>
              <Select
                placeholder={`Select ${opt.type.name}`}
                value={form.selections[opt.type.id]}
                onChange={(v) =>
                  setField('selections', {
                    ...form.selections,
                    [opt.type.id]: Number(v),
                  })
                }
              >
                {opt.values.map((val) => (
                  <Option key={val.id} value={val.id}>
                    {val.display || val.value}
                  </Option>
                ))}
              </Select>
            </FieldWrapper>
          ))}

          {!hasAllSelections && (
            <Text color="warning">Please select one value for each option type.</Text>
          )}

          {isDuplicate && (
            <Text color="error">A variation with the same option combination already exists.</Text>
          )}
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
