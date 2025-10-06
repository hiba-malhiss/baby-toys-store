import { z } from 'zod';

const localizedSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be at most 255 characters'),
  description: z
    .string()
    .max(500, 'Description must be under 500 characters')
    .optional()
    .or(z.literal('')),
});

export const materialSchema = z.object({
  translations: z.object({
    en: localizedSchema,
    ar: localizedSchema,
  }),
});

export type MaterialFormValues = z.infer<typeof materialSchema>;

export const defaultMaterialValues: MaterialFormValues = {
  translations: {
    en: { name: '', description: '' },
    ar: { name: '', description: '' },
  },
};
