import React, { useCallback, useState } from 'react';
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
import { type RegisterRequest, useRegister } from '../../api/authApi.ts';
import VerificationDialog from './VerificationDialog';
import { registerFields, registerSchema } from './registerDialog.helpers.ts';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({ open, onClose }) => {
  const toast = useToast();
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [verifyDialogVisible, setVerifyDialogVisible] = useState(false);
  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    reset,
  } = useForm<RegisterRequest>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
    resolver: zodResolver(registerSchema),
  });

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const onSubmit = async(data: RegisterRequest) => {
    try {
      await registerMutation.mutateAsync(data);
      setVerifyDialogVisible(true);
      setRegisteredEmail(data.email);
      handleClose();
    } catch(error: any) {
      toast.error(
        error.message || 'Registration failed. Please check your details and try again.'
      );
    }
  };

  return (
    <>
      <Dialog
        visible={open}
        onHide={handleClose}
        header="Create an Account"
        closable={!isSubmitting && !registerMutation.isPending}
        modal
        focusOnShow
        dismissableMask={!isSubmitting && !registerMutation.isPending}
        aria-label="Registration form"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="vertical" spacing="m" fullWidth>
            <Flex direction="horizontal" spacing="m" fullWidth>
              {['firstName', 'lastName'].map((name) => {
                const { field, fieldState: { error } } = useController({
                  name: name as keyof RegisterRequest,
                  control,
                });

                const config = registerFields.find((f) => f.name === name);

                return (
                  <FieldWrapper
                    key={name}
                    label={config?.label || name}
                    error={error?.message}
                    fullWidth
                  >
                    <StringInput
                      {...field}
                      placeholder={config?.label || name}
                      fullWidth
                      autoComplete={config?.autoComplete}
                      hasError={!!error}
                      isDisabled={isSubmitting || registerMutation.isPending}
                    />
                  </FieldWrapper>
                );
              })}
            </Flex>

            {registerFields.slice(2).map((f) => {
              const { field, fieldState: { error } } = useController({
                name: f.name,
                control,
              });

              return (
                <FieldWrapper key={f.name as string} label={f.label} error={error?.message} fullWidth>
                  <StringInput
                    {...field}
                    type={f.type || 'text'}
                    placeholder={f.label}
                    fullWidth
                    autoComplete={f.autoComplete}
                    hasError={!!error}
                    isDisabled={isSubmitting || registerMutation.isPending}
                  />
                </FieldWrapper>
              );
            })}

            <Button
              type="submit"
              fullWidth
              isDisabled={!isValid || isSubmitting || registerMutation.isPending}
              aria-label="Register account"
              isLoading={isSubmitting || registerMutation.isPending}
            >
              Register
            </Button>
          </Flex>
        </form>
      </Dialog>

      <VerificationDialog
        visible={verifyDialogVisible}
        email={registeredEmail}
        onClose={() => setVerifyDialogVisible(false)}
      />
    </>
  );
};

export default React.memo(RegisterDialog);
