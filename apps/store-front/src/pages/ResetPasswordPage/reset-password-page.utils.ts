import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty('Password is required')
      .refine((password) => password.length >= 6, {
        message: 'Password must be at least 6 characters',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['newPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
