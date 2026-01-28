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
import { getSupportedLocales } from "../../i18n/locale.ts";

const locales = getSupportedLocales();

const DEFAULT_HERO_BANNERS = locales.flatMap((locale) => [
  { text: '', imageUrl: '', locale },
  { text: '', imageUrl: '', locale },
]);

const DEFAULT_INFO_CARDS = locales.flatMap((locale) =>
  Array.from({ length: 3 }, () => ({
    title: '',
    subtitle: '',
    icon: '',
    appearance: 'primary',
    locale,
  }))
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
      const supported = locales.map((l) => l.toLowerCase());
      const byLocale: Record<string, T[]> = Object.fromEntries(
        supported.map((l) => [l, [] as T[]])
      ) as Record<string, T[]>;

      (items || []).forEach((i) => {
        if (!i || !i.locale) return;
        const code = String(i.locale).toLowerCase();
        if (!byLocale[code]) byLocale[code] = [] as T[];
        byLocale[code].push(i);
      });

      const fillFor = (code: string, count: number) => {
        const current = byLocale[code] || (byLocale[code] = [] as T[]);
        if (current.length >= count) return;
        const needed = count - current.length;
        const templates = defaults
          .filter((d) => String(d.locale).toLowerCase() === code)
          .slice(0, needed);
        byLocale[code].push(...templates);
      };

      supported.forEach((code) => {
        const countDefault = defaults.filter((d) => String(d.locale).toLowerCase() === code).length;
        fillFor(code, countDefault);
      });

      return supported.flatMap((code) => byLocale[code] || []);
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
      const uploadResults = await Promise.allSettled(
        newImages.map((file) => uploadImage.mutateAsync(file))
      );
      const uploadedUrls: string[] = uploadResults
        .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
        .map((r) => r.value);
      const failedCount = uploadResults.filter((r) => r.status === 'rejected').length;
      if (failedCount > 0) {
        toast.error(`${failedCount} image${failedCount > 1 ? 's' : ''} failed to upload`);
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
