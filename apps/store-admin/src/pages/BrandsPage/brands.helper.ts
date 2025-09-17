import { z } from 'zod';

export const brandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
