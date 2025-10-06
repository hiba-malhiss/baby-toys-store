import React, { useEffect, useState } from 'react';
import {
  Dialog,
  StringInput,
  TextArea,
  ImageUploader,
  Button,
  useToast,
  Select,
  Option,
  TabBar,
  TabBarItem,
} from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Category } from '../../api/types/category';
import {
  categorySchema,
  defaultCategoryValues,
  type CategoryFormValues,
} from './categories.helper.ts';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';
import {
  useCreateCategory,
  useUpdateCategory,
  useUploadCategoryImage,
  useCategoryAdmin,
} from '../../api/categoryApi';
import { Flex } from '@baby-toys/ui-kit';

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
  const { data: adminCategory } = useCategoryAdmin(category?.id);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
    getValues,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultCategoryValues,
  });

  useEffect(() => {
    return () => imagePreview && URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  // Reset form whenever dialog opens or category/admin data changes
  React.useEffect(() => {
    if (category?.id && adminCategory) {
      const trMap = new Map<string, any>();
      adminCategory.translations?.forEach(
        (t) => t?.locale && trMap.set(String(t.locale).toLowerCase(), t)
      );
      const en = trMap.get('en') || {};
      const ar = trMap.get('ar') || {};
      reset({
        imageUrl: adminCategory.imageUrl || '',
        isMain: adminCategory.isMain ?? false,
        translations: {
          en: { name: en.name || '', description: en.description || '' },
          ar: { name: ar.name || '', description: ar.description || '' },
        },
      });
      setImagePreview(adminCategory.imageUrl || null);
    } else if (!category?.id) {
      reset(defaultCategoryValues);
      setImagePreview(null);
    }
    setImageFile(null);
  }, [category?.id, adminCategory, reset, visible]);

  const submitForm = async (data: CategoryFormValues) => {
    try {
      const payload = {
        imageUrl: data.imageUrl || undefined,
        isMain: data.isMain ?? false,
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

      const returnedId = category?.id
        ? await updateCategory.mutateAsync({ id: category.id, ...payload })
        : await createCategory.mutateAsync(payload);

      // Upload image if a new file was selected
      if (imageFile) {
        try {
          const res = await uploadCategoryImage.mutateAsync({
            id: returnedId,
            file: imageFile,
          });
          // Update preview and form with server URL so user sees the uploaded image if dialog stays open
          if (res?.imageUrl) {
            setImagePreview(res.imageUrl);
            reset({ ...getValues(), imageUrl: res.imageUrl });
          }
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

  const footer = (
    <Button
      isLoading={isSubmitting}
      isDisabled={!isValid}
      fullWidth
      onClick={handleSubmit(submitForm)}
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
      <Flex direction="vertical" spacing="m" fullwidth>
        <TabBar
          tabs={[
            { header: 'English (en)', value: 'en' },
            { header: 'Arabic (ar)', value: 'ar' },
          ]}
          defaultSelected="en"
        >
          <TabBarItem value="en">
            <FormFieldWrapper
              name={`translations.en.name`}
              control={control}
              label="Name (en)"
              required
              fullWidth
            >
              <StringInput disabled={isSubmitting} />
            </FormFieldWrapper>
            <FormFieldWrapper
              name={`translations.en.description`}
              control={control}
              label="Description (en)"
              fullWidth
            >
              <TextArea rows={4} disabled={isSubmitting} />
            </FormFieldWrapper>
          </TabBarItem>
          <TabBarItem value="ar">
            <FormFieldWrapper
              name={`translations.ar.name`}
              control={control}
              label="Name (ar)"
              required
              fullWidth
            >
              <StringInput disabled={isSubmitting} />
            </FormFieldWrapper>
            <FormFieldWrapper
              name={`translations.ar.description`}
              control={control}
              label="Description (ar)"
              fullWidth
            >
              <TextArea rows={4} disabled={isSubmitting} />
            </FormFieldWrapper>
          </TabBarItem>
        </TabBar>

        <FormFieldWrapper name="isMain" control={control} label="Is Main" fullWidth>
          <Select>
            <Option value={true as any}>Yes</Option>
            <Option value={false as any}>No</Option>
          </Select>
        </FormFieldWrapper>

        <FormFieldWrapper name="imageUrl" label="Image" fullWidth>
          <ImageUploader
            images={imageFile ? [imageFile] : imagePreview ? [imagePreview] : []}
            multiple={false}
            onImagesChange={(files: (File | string)[]) => {
              const file = files?.[0];
              if (file instanceof File) {
                setImageFile(file);
                // Show local blob preview immediately
                const preview = URL.createObjectURL(file);
                setImagePreview(preview);
              } else if (typeof file === 'string') {
                // If component returns a string URL (e.g., previously uploaded), use it as preview
                setImagePreview(file);
                setImageFile(null);
              } else {
                setImageFile(null);
                setImagePreview(null);
              }
            }}
            isDisabled={isSubmitting}
          />
        </FormFieldWrapper>
      </Flex>
    </Dialog>
  );
};

export default CategoryDialog;
