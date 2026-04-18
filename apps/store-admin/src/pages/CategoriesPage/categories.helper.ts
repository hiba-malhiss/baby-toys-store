import { z } from 'zod';
import { getSupportedLocales } from '../../i18n/locale';

const localizedSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z
    .string()
    .max(500, 'Description must be under 500 characters')
    .optional()
    .or(z.literal('')),
});

/**
 * Category schema — translation fields are only required for active locales.
 * When translation is disabled getSupportedLocales() returns ['ar'] only.
 */
export function buildCategorySchema() {
  const locales = getSupportedLocales();
  return z.object({
    imageUrl: z.string().optional(),
    isMain: z.boolean().optional(),
    isActive: z.boolean().default(true),
    translations: z.object(
      Object.fromEntries(locales.map((l) => [l, localizedSchema])) as Record<
        string,
        typeof localizedSchema
      >
    ),
  });
}

export const categorySchema = buildCategorySchema();

export type CategoryFormValues = z.infer<typeof categorySchema>;

export function defaultCategoryValues(): CategoryFormValues {
  const locales = getSupportedLocales();
  return {
    imageUrl: '',
    isMain: false,
    isActive: true,
    translations: Object.fromEntries(locales.map((l) => [l, { name: '', description: '' }])),
  };
}
