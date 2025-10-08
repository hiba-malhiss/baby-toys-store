import React, { useState, useEffect } from 'react';
import {
  Dialog,
  StringInput,
  TextArea,
  ImageUploader,
  Button,
  useToast,
  Flex,
  TabBar,
  TabBarItem,
  Divider,
} from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Brand } from '../../api/types/brand';
import { brandSchema, type BrandFormValues, defaultBrandValues } from './brands.helper';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import {
  useCreateBrand,
  useUpdateBrand,
  useUploadBrandImage,
  useBrandAdmin,
} from '../../api/brandApi';
import { getSupportedLocales } from '../../components/i18n/locale';

interface BrandDialogProps {
  visible: boolean;
  onHide: () => void;
  onSuccess: () => void;
  brand?: Brand | null;
}

const BrandDialog: React.FC<BrandDialogProps> = ({ visible, onHide, onSuccess, brand }) => {
  const toast = useToast();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const uploadImageMutation = useUploadBrandImage();
  const { data: adminBrand } = useBrandAdmin(brand?.id);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(brand?.logoUrl || null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: defaultBrandValues,
  });

  useEffect(() => {
    return () => imagePreview && URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  useEffect(() => {
    if (brand?.id && adminBrand) {
      const trMap = new Map<string, any>();
      adminBrand.translations?.forEach(
        (t) => t?.locale && trMap.set(String(t.locale).toLowerCase(), t)
      );
      const en = trMap.get('en') || {};
      const ar = trMap.get('ar') || {};
      reset({
        logoUrl: adminBrand.logoUrl || '',
        translations: {
          en: { name: en.name || '', description: en.description || '' },
          ar: { name: ar.name || '', description: ar.description || '' },
        },
      });
      setImagePreview(adminBrand.logoUrl || null);
    } else if (!brand?.id) {
      reset(defaultBrandValues);
      setImagePreview(null);
    }
    setImageFile(null);
  }, [brand?.id, adminBrand, reset]);

  const onSubmit = async (data: BrandFormValues) => {
    try {
      const payload = {
        logoUrl: data.logoUrl || undefined,
        translations: [
          {
            locale: 'en',
            name: data.translations.en.name,
            description: data.translations.en.description || '',
          },
          {
            locale: 'ar',
            name: data.translations.ar.name,
            description: data.translations.ar.description || '',
          },
        ],
      };

      const id = brand?.id
        ? await updateBrand.mutateAsync({ id: brand.id, ...payload })
        : await createBrand.mutateAsync(payload);

      if (imageFile) {
        try {
          const targetId = brand?.id ?? id;
          await uploadImageMutation.mutateAsync({ id: targetId, file: imageFile });
        } catch (err) {
          console.error('Image upload failed:', err);
          toast.error('Brand saved, but image upload failed');
        }
      }

      toast.success(`Brand ${brand ? 'updated' : 'created'} successfully`);
      onSuccess();
      onHide();
      reset();
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      toast.error(`Failed to ${brand ? 'update' : 'create'} brand`);
    }
  };

  const footer = (
    <Button
      onClick={handleSubmit(onSubmit)}
      isLoading={isSubmitting || uploadImageMutation.isPending}
      isDisabled={isSubmitting || uploadImageMutation.isPending || !isValid}
      fullWidth
    >
      {brand ? 'Update Brand' : 'Create Brand'}
    </Button>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={brand ? 'Edit Brand' : 'Add New Brand'}
      footer={footer}
    >
      <Flex direction="vertical" spacing="m" fullwidth>
        <TabBar
          fullWidth
          size="small"
          tabs={getSupportedLocales().map((l) => ({ header: `${l.toUpperCase()} (${l})`, value: l }))}
          defaultSelected={getSupportedLocales()[0]}
        >
          {getSupportedLocales().map((l) => (
            <TabBarItem key={l} value={l}>
              <FormFieldWrapper
                name={`translations.${l}.name`}
                control={control}
                label={`Brand Name (${l})`}
                required
                fullWidth
              >
                <StringInput
                  placeholder="Enter brand name"
                  isDisabled={isSubmitting || uploadImageMutation.isPending}
                />
              </FormFieldWrapper>
              <FormFieldWrapper
                name={`translations.${l}.description`}
                control={control}
                label={`Description (${l})`}
                fullWidth
                className="bts-marginTm"
              >
                <TextArea
                  placeholder="Enter brand description"
                  rows={3}
                  isDisabled={isSubmitting || uploadImageMutation.isPending}
                />
              </FormFieldWrapper>
            </TabBarItem>
          ))}
        </TabBar>
        <Divider thickness="2px" />
        <FormFieldWrapper name="logoUrl" label="Logo" fullWidth>
          <ImageUploader
            images={imageFile ? [imageFile] : imagePreview ? [imagePreview] : []}
            multiple={false}
            onImagesChange={(files: (File | string)[]) => {
              const file = files?.[0];
              if (file instanceof File) {
                setImageFile(file);
                const preview = URL.createObjectURL(file);
                setImagePreview(preview);
              } else if (typeof file === 'string') {
                setImagePreview(file);
                setImageFile(null);
              } else {
                setImageFile(null);
                setImagePreview(null);
              }
            }}
            isDisabled={isSubmitting || uploadImageMutation.isPending}
          />
        </FormFieldWrapper>
      </Flex>
    </Dialog>
  );
};

export default BrandDialog;
