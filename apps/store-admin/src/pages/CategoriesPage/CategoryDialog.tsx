import React, { useState } from 'react';
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
import { useCreateCategory, useUpdateCategory } from '../../api/categoryApi';
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
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
  });

  // Reset form whenever dialog closes or category changes
  React.useEffect(() => {
    reset({
      name: category?.name || '',
      description: category?.description || '',
    });
    setImageFile(null);
  }, [category, reset, visible]);

  const submitForm = async (data: CategoryFormValues) => {
    try {
      const categoryData = {
        ...data,
        imageUrl: category?.imageUrl,
      };

      if (category?.id) {
        await updateCategory.mutateAsync({ ...categoryData, id: category.id });
        toast.success('Category updated successfully');
      } else {
        await createCategory.mutateAsync(categoryData);
        toast.success('Category created successfully');
      }

      onSuccess();
      onHide();
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save category');
      return false;
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={() => {
        onHide();
        setImageFile(null);
      }}
      header={category ? 'Edit Category' : 'Add New Category'}
    >
      <form onSubmit={handleSubmit(submitForm)}>
        <Flex direction="vertical" spacing="m" fullwidth>
          <FormFieldWrapper name="name" control={control} label="Name" required fullWidth>
            <StringInput disabled={isSubmitting} />
          </FormFieldWrapper>

          <FormFieldWrapper name="description" control={control} label="Description" fullWidth>
            <TextArea rows={4} disabled={isSubmitting} />
          </FormFieldWrapper>

          <FormFieldWrapper name="image" control={control as any} label="Image" fullWidth>
            <ImageUploader
              onFileSelect={setImageFile}
              defaultImage={category?.imageUrl}
              disabled={isSubmitting}
            />
          </FormFieldWrapper>
          <Button type="submit" loading={isSubmitting}>
            {category ? 'Update' : 'Create'} Category
          </Button>
        </Flex>
      </form>
    </Dialog>
  );
};

export default CategoryDialog;
