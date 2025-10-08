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

const locales = ['en', 'ar'];

const DEFAULT_HERO_BANNERS = locales.flatMap((locale) => [
  { text: '', imageUrl: '', locale },
  { text: '', imageUrl: '', locale },
]);

const DEFAULT_INFO_CARDS = locales.flatMap((locale) =>
  Array(3).fill({
    title: '',
    subtitle: '',
    icon: '',
    appearance: 'primary',
    locale,
  })
);

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

  useEffect(() => {
    if (!data) return;

    const ensurePerLocale = <T extends { locale: string }>(items: T[], defaults: T[]): T[] => {
      const byLocale: Record<string, T[]> = { en: [], ar: [] };
      (items || []).forEach((i) => {
        if (!i || !i.locale) return;
        const code = i.locale.toLowerCase() as 'en' | 'ar';
        byLocale[code].push(i);
      });

      const enCountDefault = defaults.filter((d) => d.locale === 'en').length;
      const arCountDefault = defaults.filter((d) => d.locale === 'ar').length;

      const fillFor = (code: 'en' | 'ar', count: number) => {
        const current = byLocale[code];
        if (current.length >= count) return;
        const needed = count - current.length;
        const templates = defaults.filter((d) => d.locale === code).slice(0, needed);
        byLocale[code].push(...templates);
      };

      fillFor('en', enCountDefault);
      fillFor('ar', arCountDefault);

      return [...byLocale.en, ...byLocale.ar];
    };

    const hero = ensurePerLocale(
      (data.heroBanners || []) as any,
      DEFAULT_HERO_BANNERS as any
    ) as any;
    const cards = ensurePerLocale((data.infoCards || []) as any, DEFAULT_INFO_CARDS as any) as any;

    reset({
      heroBanners: hero,
      infoCards: cards,
      galleryImages: data.galleryImages || [],
    });

    setExistingImages(data.galleryImages?.map((img) => img.imageUrl) || []);
    setNewImages([]);
  }, [data, reset]);

  const onSubmit = async (values: HomePageFormValues) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
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
    } catch (error) {
      toast.error('Failed to update homepage content');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackendDelete = async (url: string) => {
    setIsDeletingImage(true);
    try {
      await deleteImageMutation.mutateAsync(url);
      setExistingImages((imgs) => imgs.filter((img) => img !== url));
    } catch (error) {
      toast.error('Failed to delete image');
    } finally {
      setIsDeletingImage(false);
    }
  };

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
