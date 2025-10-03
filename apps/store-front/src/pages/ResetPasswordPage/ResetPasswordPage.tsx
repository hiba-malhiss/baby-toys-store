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
} from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';
import { type ResetPasswordFormData, resetPasswordSchema } from './reset-password-page.utils.ts';
import { useTranslation } from 'react-i18next';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const token = searchParams.get('token') || '';
  const { t } = useTranslation('common');

  const { isError, isSuccess, isLoading } = useValidateResetToken(token);
  const resetPassword = useResetPassword();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (isError) {
      navigate('/', {
        state: {
          showToast: true,
          toastMessage: t('auth.reset.invalidLink'),
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
            toastMessage: t('auth.reset.success'),
            toastType: 'success',
          },
        });
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('auth.reset.failed'));
    }
  };

  if (!isSuccess || isLoading) {
    return <BouncingDotsLoader />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Dialog visible={true} onHide={() => {}} header={t('auth.reset.header')} closable={false} modal>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="vertical" spacing="m" fullWidth>
            <FormFieldWrapper
              name="newPassword"
              control={control}
              label={t('auth.reset.newPassword')}
              required
              fullWidth
            >
              <StringInput
                type="password"
                placeholder={t('auth.reset.placeholder.newPassword')}
                autoComplete="new-password"
                hasError={!!errors.newPassword?.message}
                isDisabled={isSubmitting || resetPassword.isPending}
                fullWidth
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              name="confirmPassword"
              control={control}
              label={t('auth.reset.confirmNewPassword')}
              required
              fullWidth
            >
              <StringInput
                type="password"
                placeholder={t('auth.reset.placeholder.confirmNewPassword')}
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
              {t('auth.reset.submit')}
            </Button>
          </Flex>
        </form>
      </Dialog>
    </div>
  );
};

export default ResetPasswordPage;
