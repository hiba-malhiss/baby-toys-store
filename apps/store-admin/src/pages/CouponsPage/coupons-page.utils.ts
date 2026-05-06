import { z } from 'zod';

export const ADMIN_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';

export const couponSchema = z
  .object({
    code: z.string().min(5, 'Code must be at least 5 characters'),
    description: z.string().optional(),

    discountAmount: z.number().min(0).nullable().optional(),
    discountPercent: z.number().min(0).max(100).nullable().optional(),

    maxDiscount: z.number().min(0).nullable().optional(),
    minOrderAmount: z.number().min(0).nullable().optional(),

    validFrom: z.coerce.date().refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      {
        message: 'Valid from date cannot be in the past',
      }
    ),

    validUntil: z.coerce.date().nullable().optional(),

    maxUses: z.number().min(0).nullable().optional(),
  })

  // Require one discount field
  .refine(
    (data) => {
      return data.discountAmount != null || data.discountPercent != null;
    },
    {
      message: 'Either Discount Amount or Discount Percent must be provided',
      path: ['discountAmount'],
    }
  )

  // (Optional but recommended) prevent both at the same time
  .refine(
    (data) => {
      return !(data.discountAmount != null && data.discountPercent != null);
    },
    {
      message: 'Provide either discount amount OR discount percent, not both',
      path: ['discountAmount'],
    }
  )

  // Date comparison
  .refine(
    (data) => {
      if (!data.validUntil) return true;
      return data.validUntil.getTime() > data.validFrom.getTime();
    },
    {
      message: 'Valid until date must be after valid from date',
      path: ['validUntil'],
    }
  );

export type CouponFormValues = z.infer<typeof couponSchema>;
