import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useValidateResetToken, useResetPassword } from '../../api/authApi';
import {
  Dialog,
  StringInput,
  Button,
  Flex,
  BouncingDotsLoader,
  useToast,
} from '@baby-toys/ui-kit/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';
import { type ResetPasswordFormData, resetPasswordSchema } from './reset-password-page.utils.ts';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const token = searchParams.get('token') || '';

  const { isError, isSuccess, isLoading } = useValidateResetToken(token);
  const resetPassword = useResetPassword();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (isError) {
      navigate('/', {
        state: {
          showToast: true,
          toastMessage: 'Invalid or expired reset link',
          toastType: 'error',
        },
      });
    }
  }, [isError, navigate, toast]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword.mutateAsync({
        token,
        newPassword: data.newPassword,
      });
      setTimeout(() => {
        navigate('/', {
          state: {
            showToast: true,
            toastMessage: 'Password has been reset successfully',
            toastType: 'success',
          },
        });
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  if (!isSuccess || isLoading) {
    return <BouncingDotsLoader />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Dialog visible={true} onHide={() => {}} header="Reset Your Password" closable={false} modal>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="vertical" spacing="m" fullWidth>
            <FormFieldWrapper
              name="newPassword"
              control={control}
              label="New Password"
              required
              fullWidth
            >
              <StringInput
                type="password"
                placeholder="Enter new password"
                autoComplete="new-password"
                hasError={!!errors.newPassword?.message}
                isDisabled={isSubmitting || resetPassword.isPending}
                fullWidth
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              name="confirmPassword"
              control={control}
              label="Confirm New Password"
              required
              fullWidth
            >
              <StringInput
                type="password"
                placeholder="Confirm new password"
                autoComplete="new-password"
                hasError={!!errors.confirmPassword?.message}
                isDisabled={isSubmitting || resetPassword.isPending}
                fullWidth
              />
            </FormFieldWrapper>

            <Button
              type="submit"
              fullWidth
              isDisabled={isSubmitting || resetPassword.isPending}
              isLoading={isSubmitting || resetPassword.isPending}
            >
              Reset Password
            </Button>
          </Flex>
        </form>
      </Dialog>
    </div>
  );
};

export default ResetPasswordPage;
