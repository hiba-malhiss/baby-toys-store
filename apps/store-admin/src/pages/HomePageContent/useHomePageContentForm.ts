import { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@baby-toys/ui-kit';
import {
  useHomePageContent,
  useUpdateHomePageContent,
  useUploadGalleryImage,
  useDeleteGalleryImage,
} from '../../api/homePageApi';
import type { UpdateHomePageContentRequest } from '../../api/types/homePage';
import { HomePageFormValues, homePageSchema } from './homePage.helper';

const DEFAULT_HERO_BANNERS = [{ text: '' }, { text: '' }];
const DEFAULT_INFO_CARDS = Array(3).fill({
  title: '',
  subtitle: '',
  icon: '',
  appearance: 'primary',
});

export const useHomePageContentForm = () => {
  const toast = useToast();
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const { data, isLoading } = useHomePageContent();
  const updateContent = useUpdateHomePageContent();
  const uploadImage = useUploadGalleryImage();
  const deleteImageMutation = useDeleteGalleryImage();

  const form = useForm<HomePageFormValues>({
    resolver: zodResolver(homePageSchema),
    mode: 'onChange',
    defaultValues: {
      heroBanners: DEFAULT_HERO_BANNERS,
      infoCards: DEFAULT_INFO_CARDS,
      galleryImages: [],
    },
  });

  const { control, handleSubmit, reset, formState } = form;
  const { errors, isSubmitting } = formState;

  const heroBanners = useFieldArray({ control, name: 'heroBanners' }).fields;
  const infoCards = useFieldArray({ control, name: 'infoCards' }).fields;
  const galleryImageFields = useFieldArray({ control, name: 'galleryImages' }).fields;

  /** Initialize form when API data is fetched */
  useEffect(() => {
    if (!data) return;

    reset({
      heroBanners: data.heroBanners?.length ? data.heroBanners : DEFAULT_HERO_BANNERS,
      infoCards: data.infoCards?.length
        ? data.infoCards.map((c) => ({
            title: c.title ?? '',
            subtitle: c.subtitle ?? '',
            icon: c.icon ?? '',
            appearance: (c as any).appearance ?? 'primary',
          }))
        : DEFAULT_INFO_CARDS,
      galleryImages: data.galleryImages || [],
    });

    setExistingImages(data.galleryImages?.map((img) => img.imageUrl) || []);
    setNewImages([]);
  }, [data, reset]);

  /** Handle form submission */
  const onSubmit = async (values: HomePageFormValues) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Upload new files in sequence
      const uploadedUrls: string[] = [];
      for (const file of newImages) {
        const uploadedUrl = await uploadImage.mutateAsync(file);
        uploadedUrls.push(uploadedUrl);
      }

      const finalGallery = [...existingImages, ...uploadedUrls].map((url) => ({ imageUrl: url }));
      const payload: UpdateHomePageContentRequest = {
        heroBanners: values.heroBanners,
        infoCards: values.infoCards,
        galleryImages: finalGallery,
      };

      await updateContent.mutateAsync(payload);

      toast.success('Homepage content updated successfully');
      setNewImages([]);
      setExistingImages(finalGallery.map((img) => img.imageUrl));
    } catch (error) {
      console.error(error);
      toast.error('Failed to update homepage content');
    } finally {
      setIsProcessing(false);
    }
  };

  /** Delete image from backend */
  const handleBackendDelete = async (url: string) => {
    setIsDeletingImage(true);
    try {
      await deleteImageMutation.mutateAsync(url);
      setExistingImages((imgs) => imgs.filter((img) => img !== url));
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setIsDeletingImage(false);
    }
  };

  /** Update local state when gallery images change */
  const handleImagesChange = (files: (File | string)[]) => {
    const newFiles: File[] = [];
    const urls: string[] = [];

    files.forEach((item) => {
      if (item instanceof File) newFiles.push(item);
      else urls.push(item);
    });

    setNewImages(newFiles);
    setExistingImages(urls);
  };

  const galleryUploaderProps = useMemo(
    () => ({
      images: [...existingImages, ...newImages],
      multiple: true,
      onBackendDelete: handleBackendDelete,
      onImagesChange: handleImagesChange,
    }),
    [existingImages, newImages]
  );

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    heroBanners,
    infoCards,
    galleryImages: galleryImageFields,
    galleryUploaderProps,
    isLoading,
    errors,
    isSubmitting: isSubmitting || isProcessing || isDeletingImage,
  };
};
