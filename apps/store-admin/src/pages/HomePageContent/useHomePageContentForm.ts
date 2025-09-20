import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@baby-toys/ui-kit/components';
import {
  useHomePageContent,
  useUpdateHomePageContent,
  useUploadGalleryImage,
  useDeleteGalleryImage,
} from '../../api/homePageApi';
import type { UpdateHomePageContentRequest } from '../../api/types/homePage';
import { HomePageFormValues, homePageSchema } from './homePage.helper';

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

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<HomePageFormValues>({
    resolver: zodResolver(homePageSchema),
    mode: 'onChange',
    defaultValues: {
      heroBanners: [{ text: '' }, { text: '' }],
      infoCards: [
        { title: '', subtitle: '', icon: '' },
        { title: '', subtitle: '', icon: '' },
        { title: '', subtitle: '', icon: '' },
      ],
      galleryImages: [],
    },
  });

  const { fields: heroBanners } = useFieldArray({ control, name: 'heroBanners' });
  const { fields: infoCards } = useFieldArray({ control, name: 'infoCards' });
  const { fields: galleryImageFields } = useFieldArray({ control, name: 'galleryImages' });

  // Initialize form with API data
  useEffect(() => {
    if (data) {
      reset({
        heroBanners: data.heroBanners || [{ text: '' }, { text: '' }],
        infoCards: data.infoCards || [
          { title: '', subtitle: '', icon: '' },
          { title: '', subtitle: '', icon: '' },
          { title: '', subtitle: '', icon: '' },
        ],
        galleryImages: data.galleryImages || [],
      });
      setExistingImages(data.galleryImages?.map((img) => img.imageUrl) || []);
      setNewImages([]);
    }
  }, [data, reset]);

  const onSubmit = async (values: HomePageFormValues) => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      // Upload new files
      const uploadedImages = [];
      for (const file of newImages) {
        const uploaded = await uploadImage.mutateAsync(file);
        uploadedImages.push(uploaded);
      }

      // Combine existing (minus deleted) with newly uploaded images
      const finalGallery = [...existingImages, ...uploadedImages].map((url) => ({
        imageUrl: url,
      }));

      const payload: UpdateHomePageContentRequest = {
        heroBanners: values.heroBanners,
        infoCards: values.infoCards,
        galleryImages: finalGallery,
      };

      await updateContent.mutateAsync(payload);

      // Reset local state after success
      setNewImages([]);
      setExistingImages([]);

      toast.success('Homepage content updated successfully');
    } catch (error) {
      toast.error('Failed to update homepage content');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const galleryUploaderProps = {
    images: [...existingImages, ...newImages],
    multiple: true,
    onBackendDelete: async (url: string) => {
      setIsDeletingImage(true);
      try {
        await deleteImageMutation.mutateAsync(url);
        setExistingImages((imgs) => imgs.filter((img) => img !== url));
      } catch (error) {
        console.error('Error deleting image:', error);
      } finally {
        setIsDeletingImage(false);
      }
    },
    onImagesChange: (files: (File | string)[]) => {
      const urls: string[] = [];
      const filesArr: File[] = [];
      files.forEach((f) => {
        if (f instanceof File) filesArr.push(f);
        else urls.push(f);
      });
      setExistingImages(urls);
      setNewImages(filesArr);
    },
  };

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
