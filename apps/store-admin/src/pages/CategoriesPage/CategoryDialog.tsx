import React, { useEffect, useState } from 'react';
import {
  Dialog,
  StringInput,
  TextArea,
  ImageUploader,
  Button,
  useToast,
} from '@baby-toys/ui-kit/components';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Category } from '../../api/types/category';
import { categorySchema } from './categories.helper.ts';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';
import {
  useCreateCategory,
  useUpdateCategory,
  useUploadCategoryImage,
} from '../../api/categoryApi';
import { Flex } from '@baby-toys/ui-kit/components';

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  visible: boolean;
  onHide: () => void;
  onSuccess: () => void;
  category?: Category | null;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  visible,
  onHide,
  onSuccess,
  category,
}) => {
  const toast = useToast();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const uploadCategoryImage = useUploadCategoryImage();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(category?.imageUrl || null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
    getValues,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      imageUrl: category?.imageUrl || '',
    },
  });

  useEffect(() => {
    return () => imagePreview && URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  // Reset form whenever dialog closes or category changes
  React.useEffect(() => {
    reset({
      name: category?.name || '',
      description: category?.description || '',
      imageUrl: category?.imageUrl || '',
    });
    setImagePreview(category?.imageUrl || null);
    setImageFile(null);
  }, [category, reset, visible]);

  const submitForm = async (data: CategoryFormValues) => {
    try {
      const categoryData = {
        ...data,
        imageUrl: category?.imageUrl,
      };

      let result;
      if (category?.id) {
        result = await updateCategory.mutateAsync({ ...categoryData, id: category.id });
      } else {
        result = await createCategory.mutateAsync(categoryData);
      }

      // Upload image if a new file was selected
      if (imageFile) {
        try {
          await uploadCategoryImage.mutateAsync({
            id: result.id,
            file: imageFile,
          });
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('Category saved, but there was an error uploading the image');
        }
      }

      toast.success(`Category ${category ? 'updated' : 'created'} successfully`);
      onSuccess();
      onHide();
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save category');
    }
  };

  const handleImageChange = (files) => {
    const f = files[0] || null;

    if (f instanceof File) {
      setImageFile(f);
      const preview = URL.createObjectURL(f);
      setImagePreview(preview);
      reset({ ...getValues(), imageUrl: '' });
    } else {
      setImageFile(null);
      setImagePreview(null);
      reset({ ...getValues(), imageUrl: '' });
    }
  };

  const footer = (
    <Button 
      type="submit" 
      isLoading={isSubmitting} 
      isDisabled={!isValid}
      fullWidth
    >
      {category ? 'Update' : 'Create'} Category
    </Button>
  );

  return (
    <Dialog
      visible={visible}
      onHide={() => {
        onHide();
        setImageFile(null);
      }}
      header={category ? 'Edit Category' : 'Add New Category'}
      footer={footer}
    >
      <form onSubmit={handleSubmit(submitForm)}>
        <Flex direction="vertical" spacing="m" fullwidth>
          <FormFieldWrapper name="name" control={control} label="Name" required fullWidth>
            <StringInput disabled={isSubmitting} />
          </FormFieldWrapper>

          <FormFieldWrapper name="description" control={control} label="Description" fullWidth>
            <TextArea rows={4} disabled={isSubmitting} />
          </FormFieldWrapper>

          <FormFieldWrapper name="imageUrl" label="Image" fullWidth>
            <ImageUploader
              value={imagePreview ? [imagePreview] : []}
              onChange={handleImageChange}
            />
          </FormFieldWrapper>
        </Flex>
      </form>
    </Dialog>
  );
};

export default CategoryDialog;
