import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, StringInput, Button, Flex, useToast, Text } from '@baby-toys/ui-kit/components';
import { useForgotPassword } from '../../api/authApi';
import VerificationDialog from '../RegisterDialog/VerificationDialog';
import FormFieldWrapper from '../FormFieldWrapper/FormFieldWrapper.tsx';
import { schema, type FormData } from './forget-password-dialog.utils.ts';

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onClose }) => {
  const toast = useToast();
  const forgotMutation = useForgotPassword();
  const [verifyVisible, setVerifyVisible] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await forgotMutation.mutateAsync({ email: data.email });
      setSentEmail(data.email);
      setVerifyVisible(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to send reset link. Please try again.');
    }
  };

  return (
    <>
      <Dialog
        visible={open}
        onHide={handleClose}
        header="Forgot Password"
        modal
        closable={!isSubmitting && !forgotMutation.isPending}
      >
        <Text size="sm" color="muted" className="bts-marginBs">
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="vertical" spacing="m" fullWidth>
            <FormFieldWrapper name="email" control={control} label="Email" required fullWidth>
              <StringInput
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                fullWidth
                hasError={errors.email?.message}
                isDisabled={isSubmitting || forgotMutation.isPending}
              />
            </FormFieldWrapper>

            <Button
              type="submit"
              fullWidth
              style={{ marginTop: '0.5rem' }}
              isDisabled={!isValid || isSubmitting || forgotMutation.isPending}
              isLoading={isSubmitting || forgotMutation.isPending}
            >
              Send Reset Link
            </Button>
          </Flex>
        </form>
      </Dialog>

      <VerificationDialog
        visible={verifyVisible}
        email={sentEmail}
        variant="password"
        onClose={() => {
          setVerifyVisible(false);
          handleClose();
        }}
      />
    </>
  );
};

export default React.memo(ForgotPasswordDialog);
