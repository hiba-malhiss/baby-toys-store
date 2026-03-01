import { z } from 'zod';
import { BannerTextAlignment, BannerTextPosition } from '../../api/types/homePage.ts';

export const bannerSchema = z.object({
  text: z.string().min(1, 'Banner text is required'),
  imageUrl: z.string().optional(),
  alignment: z.enum(BannerTextAlignment).optional(),
  position: z.enum(BannerTextPosition).optional(),
  locale: z.enum(['en', 'ar']),
});

export const infoCardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  icon: z.string().min(1, 'Icon is required'),
  appearance: z.enum(['info', 'warning', 'success', 'primary']).optional(),
  locale: z.enum(['en', 'ar']),
});

export const galleryImageSchema = z.object({
  imageUrl: z.string(),
});

export const mainBannerSchema = z.object({
  imagesUrl: z.array(z.string()).max(5, 'Main banner can have up to 5 images').optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  alignment: z.enum(BannerTextAlignment).optional(),
  locale: z.enum(['en', 'ar']),
});

export const homePageSchema = z.object({
  banners: z.array(bannerSchema),
  infoCards: z.array(infoCardSchema),
  galleryImages: z.array(galleryImageSchema),
  mainBanners: z.array(mainBannerSchema),
});

export type HomePageFormValues = z.infer<typeof homePageSchema>;
