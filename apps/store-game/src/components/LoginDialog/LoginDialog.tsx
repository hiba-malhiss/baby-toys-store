import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, StringInput, Button, Flex, useToast } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../FormFieldWrapper/FormFieldWrapper';
import { type LoginRequest, useAdminLogin, type ApiErrorData } from '../../api/authApi';
import { isAxiosError } from 'axios';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose, onSuccess }) => {
  const toast = useToast();
  const loginMutation = useAdminLogin();
  const { t } = useTranslation('common');

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<LoginRequest>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      toast.success(response.message || 'Login successful');
      handleClose();
      onSuccess?.();
    } catch (error: unknown) {
      const msg = isAxiosError<ApiErrorData>(error) ? error.response?.data?.message : undefined;
      toast.error(msg || 'Login failed');
    }
  };

  const footer = (
    <Button
      type="submit"
      fullWidth
      isDisabled={isSubmitting || loginMutation.isPending}
      aria-label="Submit login"
      isLoading={isSubmitting || loginMutation.isPending}
    >
      Login
    </Button>
  );

  return (
    <Dialog
      visible={open}
      onHide={handleClose}
      header="Admin Login"
      closable={!isSubmitting && !loginMutation.isPending}
      modal
      focusOnShow
      dismissableMask={!isSubmitting && !loginMutation.isPending}
      aria-label="Admin login form"
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="vertical" spacing="m" fullWidth>
          <FormFieldWrapper name="email" control={control} label="Email" required fullWidth>
            <StringInput
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              fullWidth
              isDisabled={isSubmitting || loginMutation.isPending}
            />
          </FormFieldWrapper>

          <FormFieldWrapper name="password" control={control} label="Password" required fullWidth>
            <StringInput
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              fullWidth
              isDisabled={isSubmitting || loginMutation.isPending}
            />
          </FormFieldWrapper>
        </Flex>
      </form>
    </Dialog>
  );
};

export default React.memo(LoginDialog);
