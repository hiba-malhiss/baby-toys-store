import React, { useCallback } from 'react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  StringInput,
  Button,
  Flex,
  FieldWrapper,
  useToast,
} from '@baby-toys/ui-kit/components';
import { type LoginRequest, useLogin } from '../../api/authApi';
import { loginFields, loginSchema } from './loginDialog.helpers';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ 
  open, 
  onClose,
  onSuccess 
}) => {
  const toast = useToast();
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    reset,
  } = useForm<LoginRequest>({
    mode: 'onChange',
    reValidateMode: 'onChange',
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
        error.response?.data?.message || 'Login failed. Please check your credentials and try again.'
      );
    }
  };

  return (
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
          {loginFields.map((field) => {
            const { field: inputField, fieldState: { error } } = useController({
              name: field.name as keyof LoginRequest,
              control,
            });

            return (
              <FieldWrapper 
                key={field.name} 
                label={field.label} 
                error={error?.message} 
                fullWidth
              >
                <StringInput
                  {...inputField}
                  type={field.type || 'text'}
                  placeholder={field.label}
                  fullWidth
                  autoComplete={field.autoComplete}
                  hasError={!!error}
                  isDisabled={isSubmitting || loginMutation.isPending}
                />
              </FieldWrapper>
            );
          })}

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
      </form>
    </Dialog>
  );
};

export default React.memo(LoginDialog);
