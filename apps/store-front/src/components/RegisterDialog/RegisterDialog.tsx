import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, StringInput, Button, Flex, useToast } from '@baby-toys/ui-kit/components';
import { type RegisterRequest, useRegister } from '../../api/authApi.ts';
import VerificationDialog from './VerificationDialog';
import { registerFields, registerSchema } from './registerDialog.helpers.ts';
import FormFieldWrapper from '../FormFieldWrapper/FormFieldWrapper.tsx';

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
    mode: 'onBlur',
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

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await registerMutation.mutateAsync(data);
      setRegisteredEmail(data.email);
      setVerifyDialogVisible(true);
      handleClose();
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please check your details and try again.');
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
                const fieldConfig = registerFields.find((f) => f.name === name)!;
                return (
                  <FormFieldWrapper
                    key={name}
                    name={name}
                    control={control}
                    label={fieldConfig.label}
                    required
                    fullWidth
                  >
                    <StringInput
                      placeholder={fieldConfig.label}
                      autoComplete={fieldConfig.autoComplete}
                      fullWidth
                      isDisabled={isSubmitting || registerMutation.isPending}
                    />
                  </FormFieldWrapper>
                );
              })}
            </Flex>

            {['email', 'password', 'phoneNumber'].map((name) => {
              const fieldConfig = registerFields.find((f) => f.name === name)!;
              return (
                <FormFieldWrapper
                  key={name}
                  name={name}
                  control={control}
                  label={fieldConfig.label}
                  required={name !== 'phoneNumber'} // optional field
                  fullWidth
                >
                  <StringInput
                    type={fieldConfig.type || 'text'}
                    placeholder={fieldConfig.label}
                    autoComplete={fieldConfig.autoComplete}
                    fullWidth
                    isDisabled={isSubmitting || registerMutation.isPending}
                  />
                </FormFieldWrapper>
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
        variant="register"
        onClose={() => setVerifyDialogVisible(false)}
      />
    </>
  );
};

export default React.memo(RegisterDialog);
