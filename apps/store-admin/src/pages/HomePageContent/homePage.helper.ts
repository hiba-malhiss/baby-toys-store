import { z } from 'zod';

export const heroBannerSchema = z.object({
  text: z.string().min(1, 'Banner text is required'),
  imageUrl: z.string().optional(),
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

export const homePageSchema = z.object({
  heroBanners: z.array(heroBannerSchema),
  infoCards: z.array(infoCardSchema),
  galleryImages: z.array(galleryImageSchema),
});

export type HomePageFormValues = z.infer<typeof homePageSchema>;
