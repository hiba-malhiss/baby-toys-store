import { z } from 'zod';

export const contactSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z
      .union([z.literal(''), z.string().regex(/^[0-9+\-\s()]{7,20}$/, 'Invalid phone number')])
      .optional(),
    subject: z.string().min(1, 'Subject is required').max(255, 'Subject max length is 255'),
    message: z.string().min(1, 'Message is required').max(500, 'Message max length is 500'),
  })
  .superRefine((val, ctx) => {
    const hasEmail = !!val.email && val.email !== '';
    const hasPhone = !!val.phone && val.phone !== '';
    if (!hasEmail && !hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['email'],
        message: 'Email or phone is required',
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'Email or phone is required',
      });
    }
  });

export type ContactFormValues = z.infer<typeof contactSchema>;
