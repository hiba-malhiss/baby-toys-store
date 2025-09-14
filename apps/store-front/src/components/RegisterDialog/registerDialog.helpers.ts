import { z } from 'zod';
import type { RegisterRequest } from '../../api/authApi.ts';

export const registerSchema = z.object({
  email: z.string()
    .nonempty('Email is required')
    .email(),

  password: z.string()
    .nonempty('Password is required')
    .refine((password) => password.length >= 6, { message: 'Password must be at least 6 characters' }),

  firstName: z.string()
    .nonempty('First name is required')
    .refine((val) => val.trim().length > 0, { message: 'First name is required' }),

  lastName: z.string()
    .nonempty('Last name is required')
    .refine((val) => val.trim().length > 0, { message: 'Last name is required' }),

  phoneNumber: z.string()
    .optional()
    .refine((val) => !val || /^[0-9\-+()\s]+$/.test(val), { message: 'Please enter a valid phone number' }),
});

export const registerFields: Array<{
  name: keyof RegisterRequest;
  label: string;
  type?: string;
  autoComplete?: string;
}> = [
  { name: 'firstName', label: 'First Name', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last Name', autoComplete: 'family-name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
  { name: 'phoneNumber', label: 'Phone Number', type: 'tel', autoComplete: 'tel' },
];
