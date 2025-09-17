import { z } from 'zod';

export const materialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type MaterialFormValues = z.infer<typeof materialSchema>;
