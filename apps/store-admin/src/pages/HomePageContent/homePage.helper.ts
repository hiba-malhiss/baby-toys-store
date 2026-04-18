import { z } from 'zod';
import { BannerTextAlignment, VerticalAlignment } from '../../api/types/homePage.ts';

const bannerSchema = (locales: string[]) =>
  z.object({
    text: z.string().min(1, 'Banner text is required'),
    imageUrl: z.string().optional(),
    alignment: z.enum(BannerTextAlignment).optional(),
    verticalAlignment: z.enum(VerticalAlignment).optional(),
    locale: z.enum(locales as [string, ...string[]]),
  });

const infoCardSchema = (locales: string[]) =>
  z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    icon: z.string().min(1, 'Icon is required'),
    appearance: z.enum(['info', 'warning', 'success', 'primary']).optional(),
    locale: z.enum(locales as [string, ...string[]]),
  });

const galleryImageSchema = z.object({
  imageUrl: z.string(),
});

const mainBannerSchema = (locales: string[]) =>
  z.object({
    imagesUrl: z.array(z.string()).max(5, 'Main banner can have up to 5 images').optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    ctaText: z.string().optional(),
    alignment: z.enum(BannerTextAlignment).optional(),
    verticalAlignment: z.enum(VerticalAlignment).optional(),
    locale: z.enum(locales as [string, ...string[]]),
  });

export function buildHomePageSchema(locales: string[]) {
  const safeLocales: [string, ...string[]] = locales.length
    ? (locales as [string, ...string[]])
    : ['ar'];
  return z.object({
    banners: z.array(bannerSchema(safeLocales)),
    infoCards: z.array(infoCardSchema(safeLocales)),
    galleryImages: z.array(galleryImageSchema),
    mainBanners: z.array(mainBannerSchema(safeLocales)),
  });
}

// Static fallback type — the full schema shape never changes structurally
export type HomePageFormValues = {
  banners: Array<{
    text: string;
    imageUrl?: string;
    alignment?: string;
    verticalAlignment?: string;
    locale: string;
  }>;
  infoCards: Array<{
    title: string;
    subtitle: string;
    icon: string;
    appearance?: string;
    locale: string;
  }>;
  galleryImages: Array<{ imageUrl: string }>;
  mainBanners: Array<{
    imagesUrl?: string[];
    title?: string;
    subtitle?: string;
    ctaText?: string;
    alignment?: string;
    verticalAlignment?: string;
    locale: string;
  }>;
};
