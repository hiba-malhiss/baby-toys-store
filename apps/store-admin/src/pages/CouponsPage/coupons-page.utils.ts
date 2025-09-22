import { z } from 'zod';

export const couponSchema = z
  .object({
    code: z.string().min(1, 'Code is required'),
    description: z.string().optional(),
    discountAmount: z.number().min(0).optional().or(z.literal(null)),
    discountPercent: z.number().min(0).max(100).optional().or(z.literal(null)),
    maxDiscount: z.number().min(0).optional().or(z.literal(null)),
    minOrderAmount: z.number().min(0).optional().or(z.literal(null)),
    validFrom: z.date({ required_error: 'Valid from date is required' }),
    validUntil: z.date().nullable().optional(),
    maxUses: z.number().min(0).optional().or(z.literal(null)),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      return data.discountAmount != null || data.discountPercent != null;
    },
    {
      message: 'Either Discount Amount or Discount Percent must be provided',
      path: ['discountAmount'],
    }
  );

export type CouponFormValues = z.infer<typeof couponSchema>;
