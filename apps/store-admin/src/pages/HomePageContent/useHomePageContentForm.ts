import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@baby-toys/ui-kit';

import { useHomePageContent, useUpdateHomePageContent } from '../../api/homePageApi';

import {
  BannerTextAlignment,
  BannerTextPosition,
  UpdateHomePageContentRequest,
} from '../../api/types/homePage';

import { HomePageFormValues, homePageSchema } from './homePage.helper';
import { getSupportedLocales } from '../../i18n/locale';
import { useImageManager } from './useImageManager';

const locales = getSupportedLocales();

const buildDefaultBanners = () =>
  locales.flatMap((locale) =>
    Array.from({ length: 2 }, () => ({
      text: '',
      imageUrl: '',
      alignment: BannerTextAlignment.CENTER,
      position: BannerTextPosition.CENTER,
      locale,
    }))
  );

const buildDefaultInfoCards = () =>
  locales.flatMap((locale) =>
    Array.from({ length: 3 }, () => ({
      title: '',
      subtitle: '',
      icon: '',
      appearance: 'primary',
      locale,
    }))
  );

const buildDefaultMainBanners = () =>
  locales.map((locale) => ({
    imageUrl: '',
    title: '',
    subtitle: '',
    ctaText: '',
    alignment: BannerTextAlignment.RIGHT,
    locale,
  }));

const ensurePerLocale = <T extends { locale: string }>(items: T[] = [], defaults: T[]) =>
  locales.flatMap((locale) => {
    const lc = locale.toLowerCase();
    const existing = items.filter((i) => i.locale.toLowerCase() === lc);
    const required = defaults.filter((d) => d.locale.toLowerCase() === lc);
    return existing.length >= required.length
      ? existing
      : [...existing, ...required.slice(existing.length)];
  });

export const useHomePageContentForm = () => {
  const toast = useToast();
  const { data, isLoading } = useHomePageContent();
  const updateContent = useUpdateHomePageContent();

  const gallery = useImageManager();
  const banner1 = useImageManager(undefined, { multiple: false });
  const banner2 = useImageManager(undefined, { multiple: false });
  const mainBanner = useImageManager(undefined, { multiple: false });

  const form = useForm<HomePageFormValues>({
    resolver: zodResolver(homePageSchema),
    defaultValues: {
      banners: buildDefaultBanners(),
      infoCards: buildDefaultInfoCards(),
      galleryImages: [],
      mainBanners: buildDefaultMainBanners(),
    },
  });

  const { control, handleSubmit, reset, formState } = form;
  const { errors, isSubmitting } = formState;

  const banners = useFieldArray({ control, name: 'banners' }).fields;
  const infoCards = useFieldArray({ control, name: 'infoCards' }).fields;
  const galleryImages = useFieldArray({ control, name: 'galleryImages' }).fields;
  const mainBanners = useFieldArray({ control, name: 'mainBanners' }).fields;

  useEffect(() => {
    if (!data) return;

    const normalizedBanners = ensurePerLocale(data.banners, buildDefaultBanners());

    const slotUrls: Record<number, string | undefined> = {};
    locales.forEach((loc) => {
      normalizedBanners
        .filter((b) => b.locale === loc)
        .forEach((b, i) => {
          if (!slotUrls[i] && b.imageUrl) slotUrls[i] = b.imageUrl;
        });
    });

    banner1.seed(slotUrls[0] ? [slotUrls[0]] : []);
    banner2.seed(slotUrls[1] ? [slotUrls[1]] : []);
    mainBanner.seed(data.mainBanners?.map((b) => b.imageUrl).filter(Boolean));
    gallery.seed(data.galleryImages?.map((g) => g.imageUrl).filter(Boolean));

    reset({
      banners: normalizedBanners,
      infoCards: ensurePerLocale(data.infoCards, buildDefaultInfoCards()),
      galleryImages: data.galleryImages ?? [],
      mainBanners: ensurePerLocale(data.mainBanners, buildDefaultMainBanners()),
    });
  }, [data, reset]);

  const onSubmit = async (values: HomePageFormValues) => {
    try {
      // 1️⃣ Commit all image changes (upload + delete happens here)
      const galleryUrls = await gallery.commit();
      const banner1Urls = await banner1.commit();
      const banner2Urls = await banner2.commit();
      const mainBannerUrls = await mainBanner.commit();

      const latestB1 = banner1Urls[banner1Urls.length - 1];
      const latestB2 = banner2Urls[banner2Urls.length - 1];
      const latestMain = mainBannerUrls[mainBannerUrls.length - 1];
      const noB1 = banner1Urls.length === 0;
      const noB2 = banner2Urls.length === 0;
      const noMain = mainBannerUrls.length === 0;

      // 2️⃣ Apply new image URLs
      const finalBanners = values.banners.map((b, i) => {
        const slot = i % 2;
        if (slot === 0) {
          if (latestB1) return { ...b, imageUrl: latestB1 };
          if (noB1) return { ...b, imageUrl: '' };
        }
        if (slot === 1) {
          if (latestB2) return { ...b, imageUrl: latestB2 };
          if (noB2) return { ...b, imageUrl: '' };
        }
        return b;
      });

      const finalMainBanners = values.mainBanners.map((b) => ({
        ...b,
        imageUrl: latestMain ?? (noMain ? '' : b.imageUrl),
      }));

      // 3️⃣ Send payload
      const payload: UpdateHomePageContentRequest = {
        banners: finalBanners,
        infoCards: values.infoCards,
        mainBanners: finalMainBanners,
        galleryImages: galleryUrls.map((url) => ({ imageUrl: url })),
      };

      await updateContent.mutateAsync(payload);

      toast.success('Homepage updated successfully');
    } catch {
      toast.error('Failed to update homepage');
    }
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    banners,
    infoCards,
    galleryImages,
    mainBanners,
    galleryUploaderProps: gallery.uploaderProps,
    banner1UploaderProps: { ...banner1.uploaderProps, multiple: false },
    banner2UploaderProps: { ...banner2.uploaderProps, multiple: false },
    mainBannerUploaderProps: { ...mainBanner.uploaderProps, multiple: false },
    isLoading,
    errors,
    isSubmitting:
      isSubmitting ||
      gallery.isProcessing ||
      banner1.isProcessing ||
      banner2.isProcessing ||
      mainBanner.isProcessing,
  };
};
