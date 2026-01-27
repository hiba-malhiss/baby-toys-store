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
  Divider,
  Toggle,
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
import { getSupportedLocales } from '../../components/i18n/locale';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
    setValue,
    watch,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultCategoryValues,
  });

  useEffect(() => {
    return () => imagePreview && URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const isActiveValue = watch('isActive');

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
        isActive: adminCategory.isActive ?? true,
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
        isActive: data.isActive ?? true,
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
          toast.error(t('categories.imageUploadError'));
        }
      }

      toast.success(category ? t('categories.updateSuccess') : t('categories.createSuccess'));
      onSuccess();
      onHide();
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      toast.error(err?.message || t('categories.saveError'));
    }
  };

  const footer = (
    <Button
      isLoading={isSubmitting}
      isDisabled={!isValid}
      fullWidth
      onClick={handleSubmit(submitForm)}
    >
      {category ? t('categories.update') : t('categories.create')}
    </Button>
  );

  return (
    <Dialog
      visible={visible}
      onHide={() => {
        onHide();
        setImageFile(null);
      }}
      header={category ? t('categories.editTitle') : t('categories.addTitle')}
      footer={footer}
    >
      <Flex direction="vertical" spacing="m" fullWidth>
        <TabBar
          size="small"
          tabs={getSupportedLocales().map((l) => ({
            header: `${l.toUpperCase()} (${l})`,
            value: l,
          }))}
          defaultSelected={getSupportedLocales()[0]}
          fullWidth
        >
          {getSupportedLocales().map((l) => (
            <TabBarItem key={l} value={l}>
              <FormFieldWrapper
                name={`translations.${l}.name`}
                control={control}
                label={t('categories.fields.name', { locale: l })}
                required
                fullWidth
              >
                <StringInput isDisabled={isSubmitting} />
              </FormFieldWrapper>
              <FormFieldWrapper
                name={`translations.${l}.description`}
                control={control}
                label={t('categories.fields.description', { locale: l })}
                fullWidth
                className="bts-marginTm"
              >
                <TextArea rows={4} isDisabled={isSubmitting} />
              </FormFieldWrapper>
            </TabBarItem>
          ))}
        </TabBar>

        <Divider thickness="2px" />
        <FormFieldWrapper
          name="isActive"
          control={control}
          label={t('categories.fields.isActive')}
          fullWidth
        >
          <Select>
            <Option value={true as any}>{t('app.yes')}</Option>
            <Option value={false as any}>{t('app.no')}</Option>
          </Select>
        </FormFieldWrapper>
        <FormFieldWrapper
          name="isMain"
          control={control}
          label={t('categories.fields.isMain')}
          fullWidth
        >
          <Select>
            <Option value={true as any}>{t('app.yes')}</Option>
            <Option value={false as any}>{t('app.no')}</Option>
          </Select>
        </FormFieldWrapper>
        <FormFieldWrapper name="imageUrl" label={t('categories.fields.image')} fullWidth>
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
