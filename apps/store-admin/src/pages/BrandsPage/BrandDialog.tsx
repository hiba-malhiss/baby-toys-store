import React, { useState, useEffect } from 'react';
import {
  Dialog,
  StringInput,
  TextArea,
  ImageUploader,
  Button,
  useToast,
  Flex,
} from '@baby-toys/ui-kit/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Brand } from '../../api/types/brand';
import { brandSchema, type BrandFormValues } from './brands.helper';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { useCreateBrand, useUpdateBrand, useUploadBrandImage } from '../../api/brandApi';

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(brand?.logoUrl || null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
    getValues,
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name || '',
      description: brand?.description || '',
      logoUrl: brand?.logoUrl || '',
    },
  });

  useEffect(() => {
    return () => imagePreview && URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  useEffect(() => {
    reset({
      name: brand?.name || '',
      description: brand?.description || '',
      logoUrl: brand?.logoUrl || '',
    });
    setImagePreview(brand?.logoUrl || null);
    setImageFile(null);
  }, [brand, reset]);

  const onSubmit = async (data: BrandFormValues) => {
    try {
      const brandData = { ...data, logoUrl: data.logoUrl };
      let result: Brand;

      if (brand) {
        result = await updateBrand.mutateAsync({ ...brandData, id: brand.id });
      } else {
        result = await createBrand.mutateAsync(brandData);
      }

      if (imageFile) {
        try {
          await uploadImageMutation.mutateAsync({ id: result.id, file: imageFile });
        } catch (err) {
          console.error('Image upload failed:', err);
          toast.warning('Brand saved, but image upload failed');
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

  const handleImageChange = (files) => {
    const f = files[0] || null;

    if (f instanceof File) {
      setImageFile(f);
      const preview = URL.createObjectURL(f);
      setImagePreview(preview);
      reset({ ...getValues(), logoUrl: '' }); // clear previous URL
    } else {
      setImageFile(null);
      setImagePreview(null);
      reset({ ...getValues(), logoUrl: '' }); // clear previous URL
    }
  };

  return (
    <Dialog visible={visible} onHide={onHide} header={brand ? 'Edit Brand' : 'Add New Brand'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="vertical" spacing="m" fullwidth>
          <FormFieldWrapper name="name" control={control} label="Brand Name" required fullWidth>
            <StringInput placeholder="Enter brand name" />
          </FormFieldWrapper>

          <FormFieldWrapper name="description" control={control} label="Description" fullWidth>
            <TextArea placeholder="Enter brand description" rows={3} />
          </FormFieldWrapper>

          <FormFieldWrapper name="logoUrl" label="Logo" fullWidth>
            <ImageUploader
              value={imagePreview ? [imagePreview] : []}
              onChange={handleImageChange}
            />
          </FormFieldWrapper>

          <Button
            type="submit"
            isLoading={isSubmitting || uploadImageMutation.isPending}
            isDisabled={isSubmitting || uploadImageMutation.isPending || !isValid}
            fullWidth
          >
            {brand ? 'Update Brand' : 'Create Brand'}
          </Button>
        </Flex>
      </form>
    </Dialog>
  );
};

export default BrandDialog;
