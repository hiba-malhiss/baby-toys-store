import { z } from 'zod';
import type { RegisterRequest } from '../../api/authApi.ts';

export const registerSchema = z.object({
  email: z.string().nonempty('Email is required').email(),

  password: z
    .string()
    .nonempty('Password is required')
    .refine((password) => password.length >= 6, {
      message: 'Password must be at least 6 characters',
    }),

  firstName: z
    .string()
    .nonempty('First name is required')
    .refine((val) => val.trim().length > 0, { message: 'First name is required' }),

  lastName: z
    .string()
    .nonempty('Last name is required')
    .refine((val) => val.trim().length > 0, { message: 'Last name is required' }),

  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9\-+()\s]+$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
  age: z.coerce
    .number()
    .optional()
    .refine((val) => val === undefined || (Number.isFinite(val) && val >= 5 && val <= 120), {
      message: 'Please enter a valid age (5-120)',
    }),
  country: z
    .string()
    .optional()
    .refine((val) => !val || val.trim().length > 0, { message: 'Please enter a valid country' }),
});

export type RegisterField = {
  name: keyof RegisterRequest;
  labelKey: string;
  placeholderKey: string;
  type?: string;
  autoComplete?: string;
};

export const registerFields: Array<RegisterField> = [
  {
    name: 'firstName',
    labelKey: 'auth.dialogs.register.firstNameLabel',
    placeholderKey: 'auth.dialogs.register.firstNamePlaceholder',
    autoComplete: 'given-name',
  },
  {
    name: 'lastName',
    labelKey: 'auth.dialogs.register.lastNameLabel',
    placeholderKey: 'auth.dialogs.register.lastNamePlaceholder',
    autoComplete: 'family-name',
  },
  {
    name: 'email',
    labelKey: 'auth.dialogs.register.emailLabel',
    placeholderKey: 'auth.dialogs.register.emailPlaceholder',
    type: 'email',
    autoComplete: 'email',
  },
  {
    name: 'password',
    labelKey: 'auth.dialogs.register.passwordLabel',
    placeholderKey: 'auth.dialogs.register.passwordPlaceholder',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    name: 'phoneNumber',
    labelKey: 'auth.dialogs.register.phoneLabel',
    placeholderKey: 'auth.dialogs.register.phonePlaceholder',
    type: 'tel',
    autoComplete: 'tel',
  },
  {
    name: 'age',
    labelKey: 'auth.dialogs.register.ageLabel',
    placeholderKey: 'auth.dialogs.register.agePlaceholder',
    type: 'number',
    autoComplete: 'off',
  },
  {
    name: 'country',
    labelKey: 'auth.dialogs.register.countryLabel',
    placeholderKey: 'auth.dialogs.register.countryPlaceholder',
    type: 'text',
    autoComplete: 'country-name',
  },
];
