import { z } from 'zod';

export const generalSchema = z.object({
  currency: z.string().min(1, 'Currency is required').max(10),
  currencySymbol: z.string().min(1, 'Currency symbol is required').max(5),
  timezone: z.string().min(1, 'Timezone is required').max(100),
  priceRangeMin: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Min price must be a number')
    .optional()
    .default(''),
  priceRangeMax: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Max price must be a number')
    .optional()
    .default(''),
});

export const contactSchema = z.object({
  workDays: z.string().min(1, 'Working days are required').max(100),
  workTimes: z.string().min(1, 'Working times are required').max(100),
  phone: z.string().min(1, 'Phone is required').max(50),
  email: z.string().email('Invalid email').max(100),
  address: z.string().min(1, 'Address is required').max(500),
});

export const policiesSchema = z
  .object({
    cancelPolicy: z.string().max(4000).optional().default(''),
    returnPolicy: z.string().max(8000).optional().default(''),
    shippingPolicy: z.string().max(8000).optional().default(''),
    freeShippingMinSubtotal: z.number().nullable().optional(),
    freeShippingStartAt: z.date().nullable().optional(),
    freeShippingEndAt: z.date().nullable().optional(),
  })
  .superRefine((val, ctx) => {
    const { freeShippingMinSubtotal: min, freeShippingStartAt: s, freeShippingEndAt: e } = val;

    if (typeof min === 'number') {
      if (!s || !e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['freeShippingMinSubtotal'],
          message: 'Start and end dates are required when free shipping subtotal is set',
        });
      }
    }
    if (s && e && e <= s) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['freeShippingEndAt'],
        message: 'End time must be after start time',
      });
    }
  });

export const settingsSchema = z.object({
  general: generalSchema,
  contact: contactSchema,
  policies: policiesSchema,
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
