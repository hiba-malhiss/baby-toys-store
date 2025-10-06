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

export const productSchema = z
  .object({
    price: z.number().min(1, 'Price must be positive'),
    oldPrice: z.number().nullable(),
    stockQuantity: z.number().min(0, 'Stock quantity must be non-negative'),
    releaseDate: z.string().optional(),
    mainImage: z.string(),
    images: z.array(z.string()).max(10, 'You can upload at most 10 images').optional().default([]),
    isActive: z.boolean().optional().default(true),
    categoryId: z.number().min(1, 'Category is required').optional(),
    brandId: z.number().optional(),
    materialIds: z.array(z.number()).optional().default([]),
    colorIds: z.array(z.number()).optional().default([]),
    // localized
    translations: z.object({
      en: localizedFieldsSchema,
      ar: localizedFieldsSchema,
    }),
  })
  .superRefine((val, ctx) => {
    if (val.oldPrice != null) {
      if (typeof val.oldPrice !== 'number' || Number.isNaN(val.oldPrice)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Old price must be a number',
          path: ['oldPrice'],
        });
      } else if (val.price != null && val.oldPrice < val.price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Old price must be greater than or equal to price',
          path: ['oldPrice'],
        });
      }
    }
  });

export const defaultProductValues = {
  // non-localized
  price: undefined as unknown as number,
  oldPrice: undefined as unknown as number | undefined,
  stockQuantity: undefined as unknown as number,
  releaseDate: '',
  mainImage: '',
  images: [] as string[],
  isActive: true,
  categoryId: undefined as unknown as number | undefined,
  brandId: undefined as unknown as number | undefined,
  materialIds: [] as number[],
  colorIds: [] as number[],
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
