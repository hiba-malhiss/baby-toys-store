import { z } from 'zod';

const localizedFieldsSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be at most 255 characters'),
  shortDescription: z
    .string()
    .min(1, 'Short description is required')
    .max(500, 'Short description must be at most 500 characters'),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
  featureBullets: z
    .array(z.string().max(255, 'Each feature bullet must be at most 255 characters'))
    .max(10, 'You can have at most 10 feature bullets')
    .optional()
    .default(['']),
  details: z
    .array(
      z.object({
        label: z.string().max(100, 'Detail label must be at most 100 characters'),
        value: z.string().max(500, 'Detail value must be at most 500 characters'),
      })
    )
    .optional()
    .default([]),
});

export const productSchema = z.object({
  releaseDate: z.string().optional(),
  mainImage: z.string(),
  images: z.array(z.string()).max(10, 'You can upload at most 10 images').optional().default([]),
  isActive: z.boolean().optional().default(true),
  categoryId: z.number().min(1, 'Category is required').optional(),
  // product attributes (type + one or more values)
  attributes: z
    .array(
      z.object({
        attributeTypeId: z.coerce.number().min(1, 'Attribute type is required'),
        valueIds: z.array(z.coerce.number()).optional().default([]),
      })
    )
    .optional()
    .default([]),
  options: z
    .array(
      z.object({
        optionTypeId: z.coerce.number().min(1, 'Option type is required'),
        valueIds: z.array(z.coerce.number()).optional().default([]),
      })
    )
    .optional()
    .default([]),
  // localized
  translations: z.object({
    en: localizedFieldsSchema,
    ar: localizedFieldsSchema,
  }),
});

export const defaultProductValues = {
  // non-localized
  releaseDate: '',
  mainImage: '',
  images: [] as string[],
  isActive: true,
  categoryId: undefined as unknown as number | undefined,
  options: [] as Array<{ optionTypeId: number; valueIds: number[] }>,
  attributes: [] as Array<{ attributeTypeId: number; valueIds: number[] }>,
  // localized for en and ar
  translations: {
    en: {
      name: '',
      shortDescription: '',
      description: '',
      featureBullets: [''],
      details: [] as { label: string; value: string }[],
    },
    ar: {
      name: '',
      shortDescription: '',
      description: '',
      featureBullets: [''],
      details: [] as { label: string; value: string }[],
    },
  },
};
