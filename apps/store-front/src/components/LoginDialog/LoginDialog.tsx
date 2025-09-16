import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, StringInput, Button, Flex, useToast } from '@baby-toys/ui-kit/components';
import { type LoginRequest, useLogin } from '../../api/authApi';
import { loginFields, loginSchema } from './loginDialog.helpers';
import ForgotPasswordDialog from '../ResetPassword/ForgotPasswordDialog.tsx';
import FormFieldWrapper from '../FormFieldWrapper/FormFieldWrapper.tsx';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose, onSuccess }) => {
  const toast = useToast();
  const loginMutation = useLogin();
  const [forgotOpen, setForgotOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
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
      toast.success(response.message || 'Login successful!');
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Login failed. Please check your credentials and try again.'
      );
    }
  };

  return (
    <>
      <Dialog
        visible={open}
        onHide={handleClose}
        header="Login to Your Account"
        closable={!isSubmitting && !loginMutation.isPending}
        modal
        focusOnShow
        dismissableMask={!isSubmitting && !loginMutation.isPending}
        aria-label="Login form"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="vertical" spacing="m" fullWidth>
            {loginFields.map((field) => (
              <FormFieldWrapper
                key={field.name}
                name={field.name}
                control={control}
                label={field.label}
                required
                fullWidth
              >
                <StringInput
                  type={field.type || 'text'}
                  placeholder={field.label}
                  autoComplete={field.autoComplete}
                  fullWidth
                  isDisabled={isSubmitting || loginMutation.isPending}
                />
              </FormFieldWrapper>
            ))}

            <Flex spacing="m" fullWidth justify="end">
              <Button
                appearance="link"
                color="underline"
                fullWidth
                onClick={() => {
                  handleClose();
                  setForgotOpen(true);
                }}
              >
                Forgot Password?
              </Button>

              <Button
                type="submit"
                fullWidth
                isDisabled={!isValid || isSubmitting || loginMutation.isPending}
                aria-label="Login to account"
                isLoading={isSubmitting || loginMutation.isPending}
              >
                Login
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog>

      <ForgotPasswordDialog open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </>
  );
};

export default React.memo(LoginDialog);
