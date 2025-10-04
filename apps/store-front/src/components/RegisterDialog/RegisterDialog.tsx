import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, StringInput, Button, Flex, useToast } from '@baby-toys/ui-kit';
import { type RegisterRequest, useRegister } from '../../api/authApi.ts';
import VerificationDialog from './VerificationDialog';
import { registerFields, registerSchema } from './registerDialog.helpers.ts';
import FormFieldWrapper from '../FormFieldWrapper/FormFieldWrapper.tsx';
import { useTranslation } from 'react-i18next';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({ open, onClose }) => {
  const toast = useToast();
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [verifyDialogVisible, setVerifyDialogVisible] = useState(false);
  const registerMutation = useRegister();
  const { t } = useTranslation('common');

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
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
      toast.error(error.message || t('auth.dialogs.register.failure'));
    }
  };

  return (
    <>
      <Dialog
        visible={open}
        onHide={handleClose}
        header={t('auth.dialogs.register.header')}
        closable={!isSubmitting && !registerMutation.isPending}
        modal
        focusOnShow
        dismissableMask={!isSubmitting && !registerMutation.isPending}
        aria-label={t('auth.dialogs.register.formAria')}
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
                    label={t(fieldConfig.labelKey)}
                    required
                    fullWidth
                  >
                    <StringInput
                      placeholder={t(fieldConfig.placeholderKey)}
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
                  label={t(fieldConfig.labelKey)}
                  required={name !== 'phoneNumber'} // optional field
                  fullWidth
                >
                  <StringInput
                    type={fieldConfig.type || 'text'}
                    placeholder={t(fieldConfig.placeholderKey)}
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
              isDisabled={isSubmitting || registerMutation.isPending}
              aria-label={t('auth.dialogs.register.submitAria')}
              isLoading={isSubmitting || registerMutation.isPending}
            >
              {t('auth.dialogs.register.submitLabel')}
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
