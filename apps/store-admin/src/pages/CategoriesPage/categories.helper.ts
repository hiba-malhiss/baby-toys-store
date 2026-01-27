import { z } from 'zod';

const localizedSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z
    .string()
    .max(500, 'Description must be under 500 characters')
    .optional()
    .or(z.literal('')),
});

export const categorySchema = z.object({
  imageUrl: z.string().optional(),
  isMain: z.boolean().optional(),
  isActive: z.boolean().default(true),
  // translations
  translations: z.object({
    en: localizedSchema,
    ar: localizedSchema,
  }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const defaultCategoryValues: CategoryFormValues = {
  imageUrl: '',
  isMain: false,
  isActive: true,
  translations: {
    en: { name: '', description: '' },
    ar: { name: '', description: '' },
  },
};
