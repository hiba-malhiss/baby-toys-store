import { z } from 'zod';

export const heroBannerSchema = z.object({
  text: z.string().min(1, 'Banner text is required'),
});

export const infoCardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  icon: z.string().min(1, 'Icon is required'),
  appearance: z.enum(['info', 'warning', 'success', 'primary']).optional(),
});

export const galleryImageSchema = z.object({});

export const homePageSchema = z.object({
  heroBanners: z.array(heroBannerSchema).length(2, 'Exactly 2 hero banners required'),
  infoCards: z.array(infoCardSchema).length(3, 'Exactly 3 info cards required'),
  galleryImages: z.array(galleryImageSchema),
});

export type HomePageFormValues = z.infer<typeof homePageSchema>;
