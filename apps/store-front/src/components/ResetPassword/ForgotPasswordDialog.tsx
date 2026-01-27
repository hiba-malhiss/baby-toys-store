import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, StringInput, Button, Flex, useToast, Text } from '@baby-toys/ui-kit';
import { useForgotPassword } from '../../api/authApi';
import VerificationDialog from '../RegisterDialog/VerificationDialog';
import FormFieldWrapper from '../FormFieldWrapper/FormFieldWrapper.tsx';
import { schema, type FormData } from './forget-password-dialog.utils.ts';
import { useTranslation } from 'react-i18next';

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onClose }) => {
  const toast = useToast();
  const forgotMutation = useForgotPassword();
  const [verifyVisible, setVerifyVisible] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const { t } = useTranslation('common');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    mode: 'onBlur',
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
      toast.error(e?.response?.data?.message || t('auth.dialogs.forgot.failure'));
    }
  };

  return (
    <>
      <Dialog
        visible={open}
        onHide={handleClose}
        header={t('auth.dialogs.forgot.header')}
        modal
        closable={!isSubmitting && !forgotMutation.isPending}
      >
        <Text size="sm" color="muted" className="bts-marginBs">
          {t('auth.dialogs.forgot.description')}
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="vertical" spacing="m" fullWidth>
            <FormFieldWrapper
              name="email"
              control={control}
              label={t('auth.dialogs.forgot.emailLabel')}
              required
              fullWidth
            >
              <StringInput
                type="email"
                placeholder={t('auth.dialogs.forgot.emailPlaceholder')}
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
              isDisabled={isSubmitting || forgotMutation.isPending}
              isLoading={isSubmitting || forgotMutation.isPending}
            >
              {t('auth.dialogs.forgot.submitLabel')}
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
