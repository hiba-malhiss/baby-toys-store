import { z } from 'zod';

export const generalSchema = z.object({
  currency: z.string().min(1).max(10),
  currencySymbol: z.string().min(1).max(5),
  timezone: z.string().min(1).max(100),
  priceRangeMin: z.coerce.number().int().min(1),
  priceRangeMax: z.coerce.number().int().min(1),
  dailyOrdersGoal: z.coerce.number().int().min(1),
  monthlyRevenueGoal: z.coerce.number().int().min(1),
});

export const contactSchema = z.object({
  workDays: z.string().min(1),
  workTimes: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
});

export const policiesLocaleSchema = z.object({
  cancelPolicy: z.string().min(1),
  returnPolicy: z.string().min(1),
  shippingPolicy: z.string().min(1),
});

export const policiesGlobalSchema = z.object({
  freeShippingMinSubtotal: z.number().nullable().optional(),
  freeShippingStartAt: z.date().nullable().optional(),
  freeShippingEndAt: z.date().nullable().optional(),
});

export const settingsSchema = (locales: string[]) =>
  z.object({
    general: generalSchema,
    contact: z.record(z.enum(locales as [string, ...string[]]), contactSchema),
    policies: z.record(z.enum(locales as [string, ...string[]]), policiesLocaleSchema),
    policiesGlobal: policiesGlobalSchema,
  });

export type SettingsFormValues = z.infer<ReturnType<typeof settingsSchema>>;
