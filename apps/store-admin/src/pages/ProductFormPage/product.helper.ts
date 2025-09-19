import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  shortDescription: z.string().min(1, 'Short description is required'),
  price: z.number().min(1, 'Price must be positive'),
  stockQuantity: z.number().min(0, 'Stock quantity must be non-negative'),
  releaseDate: z.string().optional(),
  mainImage: z.string(),
  images: z.array(z.string()).optional().default([]),
  featureBullets: z.array(z.string()).optional().default(['']),
  details: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional()
    .default([]),
  isActive: z.boolean().optional().default(true),
  categoryId: z.number().min(1, 'Category is required').optional(),
  brandId: z.number().optional(),
  materialIds: z.array(z.number()).optional().default([]),
  colorIds: z.array(z.number()).optional().default([]),
});

export const defaultProductValues = {
  name: '',
  description: '',
  shortDescription: '',
  price: undefined,
  stockQuantity: undefined,
  releaseDate: '',
  mainImage: '',
  images: [],
  featureBullets: [''],
  details: [],
  isActive: true,
  categoryId: undefined,
  brandId: undefined,
  materialIds: [],
  colorIds: [],
};
