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
import { useCreateBrand, useUpdateBrand } from '../../api/brandApi';

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
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (brand) {
      reset({
        name: brand.name || '',
        description: brand.description || '',
        logoUrl: brand.logoUrl || '',
      });
    } else {
      reset({
        name: '',
        description: '',
        logoUrl: '',
      });
    }
  }, [brand]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name || '',
      description: brand?.description || '',
      logoUrl: brand?.logoUrl || '',
    },
  });

  const onSubmit = async (data: BrandFormValues) => {
    try {
      const brandData = {
        ...data,
        // Here you would typically upload the image file to a storage service
        // and get the URL to save with the brand
        logoUrl: data.logoUrl,
      };

      if (brand) {
        await updateBrand.mutateAsync({ ...brandData, id: brand.id });
        toast.success('Brand updated successfully');
      } else {
        await createBrand.mutateAsync(brandData);
        toast.success('Brand created successfully');
      }

      onSuccess();
      onHide();
      reset();
    } catch (error) {
      toast.error(`Failed to ${brand ? 'update' : 'create'} brand`);
    }
  };

  const handleImageUpload = (file: File | null) => {
    setImageFile(file);
    // Here you would typically upload the file to a storage service
    // and get the URL to save with the brand
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

          <FormFieldWrapper name="logoUrl" control={control} label="Logo URL" fullWidth>
            <ImageUploader onFileSelect={handleImageUpload} previewUrl={brand?.logoUrl} />
          </FormFieldWrapper>
          <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting} disabled={isSubmitting}>
            {brand ? 'Update' : 'Create'}
          </Button>
        </Flex>
      </form>
    </Dialog>
  );
};

export default BrandDialog;
