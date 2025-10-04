import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginField = {
  name: 'email' | 'password';
  labelKey: string;
  placeholderKey: string;
  type: 'email' | 'password';
  autoComplete: string;
};

export const loginFields: readonly LoginField[] = [
  {
    name: 'email',
    labelKey: 'auth.dialogs.login.emailLabel',
    placeholderKey: 'auth.dialogs.login.emailPlaceholder',
    type: 'email',
    autoComplete: 'email',
  },
  {
    name: 'password',
    labelKey: 'auth.dialogs.login.passwordLabel',
    placeholderKey: 'auth.dialogs.login.passwordPlaceholder',
    type: 'password',
    autoComplete: 'current-password',
  },
] as const;
