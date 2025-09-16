import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autoComplete: 'email',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    autoComplete: 'current-password',
  },
] as const;
