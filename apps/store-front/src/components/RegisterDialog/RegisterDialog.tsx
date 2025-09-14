import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

// Remove generic, just type for RegisterRequest
const FormField = React.memo(function FormField({
                                                  name,
                                                  control,
                                                  errors,
                                                  label,
                                                  type = 'text',
                                                  autoComplete,
                                                  disabled,
                                                }: {
  name: keyof RegisterRequest;
  control: any;
  errors: any;
  label: string;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
}){
  const error = errors[name]?.message as string | undefined;

  return (
    <FieldWrapper label={label} error={error} fullWidth>
      <Controller
        name={name as string}
        control={control}
        render={({ field }) => (
          <StringInput
            {...field}
            type={type}
            placeholder={label}
            fullWidth
            autoComplete={autoComplete}
            hasError={!!error}
            isDisabled={disabled}
          />
        )}
      />
    </FieldWrapper>
  );
});

const RegisterDialog: React.FC<RegisterDialogProps> = ({ open, onClose }) => {
  const toast = useToast();
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [verifyDialogVisible, setVerifyDialogVisible] = useState(false);
  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<RegisterRequest>({
    mode: 'onChange',
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
        error.message ||
        'Registration failed. Please check your details and try again.',
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
              <FormField
                name="firstName"
                control={control}
                errors={errors}
                label="First Name"
                autoComplete="given-name"
                disabled={isSubmitting || registerMutation.isPending}
              />
              <FormField
                name="lastName"
                control={control}
                errors={errors}
                label="Last Name"
                autoComplete="family-name"
                disabled={isSubmitting || registerMutation.isPending}
              />
            </Flex>

            {registerFields.slice(2).map((f) => (
              <FormField
                key={f.name as string}
                name={f.name}
                control={control}
                errors={errors}
                label={f.label}
                type={f.type}
                autoComplete={f.autoComplete}
                disabled={isSubmitting || registerMutation.isPending}
              />
            ))}

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
