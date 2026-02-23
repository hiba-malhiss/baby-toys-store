import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Button, Flex, Dialog, isValidEmail } from '@baby-toys/ui-kit';
import { useToast } from '@baby-toys/ui-kit';
import { useResendVerification, useResendVerificationByEmail } from '../api/authApi';
import { handleRateLimit } from '../api/rateLimit';
import { useAuth } from '../context/AuthContext.tsx';
import { useTranslation } from 'react-i18next';

type Props = {
  onVisibilityChange?: (open: boolean) => void;
};

const VerificationResendDialog: React.FC<Props> = ({ onVisibilityChange }) => {
  const location = useLocation();
  const toast = useToast();
  const { mutate: resend, isPending } = useResendVerification();
  const { mutate: resendByEmail, isPending: isPendingEmail } = useResendVerificationByEmail();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('common');

  const state = (location.state || {}) as any;
  const stateOpen = Boolean(state?.showVerifyDialog);
  const stateToken = (state?.verifyToken as string) || null;

  const qsOpen = searchParams.get('showVerifyDialog') === '1';
  const qsToken = searchParams.get('token');
  const qsEmail = searchParams.get('email');

  const token = stateToken || qsToken || null;
  const email = isValidEmail(qsEmail) ? qsEmail : null;

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    // Open when:
    // - state says open and we have a token from state, OR
    // - query says open and we have either token or a VALID email
    const shouldOpen = (stateOpen && stateToken) || (qsOpen && (qsToken || isValidEmail(qsEmail)));
    setOpen(!!shouldOpen);
  }, [stateOpen, stateToken, qsOpen, qsToken, qsEmail]);

  // Notify parent when visibility changes (e.g., to close login dialog)
  const wasOpenRef = useRef<boolean>(false);
  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    if (open && !wasOpen) {
      onVisibilityChange?.(true);
    } else if (!open && wasOpen) {
      onVisibilityChange?.(false);
    }
    wasOpenRef.current = open;
    // Intentionally ignore callback identity to avoid re-running on every parent re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // If the user is authenticated, ensure the dialog is not shown and clear params/state
  useEffect(() => {
    if (!isAuthenticated) return;
    if (open || stateOpen || qsOpen) {
      setOpen(false);
      clearStateAndQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const clearStateAndQuery = () => {
    // Clear location state to prevent re-open
    const newState = { ...(location.state as any) };
    if (newState) {
      delete newState.showVerifyDialog;
      delete newState.verifyToken;
      window.history.replaceState(
        newState,
        document.title,
        window.location.pathname + window.location.search
      );
    }

    // Clear URL query params related to the dialog
    const next = new URLSearchParams(searchParams);
    next.delete('showVerifyDialog');
    next.delete('email');
    next.delete('token');
    setSearchParams(next, { replace: true });
  };

  const handleClose = () => {
    setOpen(false);
    clearStateAndQuery();
  };

  const handleResend = () => {
    if (token) {
      resend(
        { token },
        {
          onSuccess: (res) => {
            toast.success(
              res?.message ||
                t('auth.dialogs.verifyResend.success', {
                  defaultValue: 'We sent you a new verification link.',
                })
            );
            handleClose();
          },
          onError: (err: any) => {
            if (handleRateLimit(err, toast, t, 'rateLimit.verifyResend.cooldown')) {
              return;
            }
            const msg =
              err?.response?.data?.message ||
              t('auth.dialogs.verifyResend.failure', {
                defaultValue: 'Failed to resend verification email.',
              });
            toast.error(msg);
          },
        }
      );
    } else if (email) {
      resendByEmail(
        { email },
        {
          onSuccess: (res) => {
            toast.success(
              res?.message ||
                t('auth.dialogs.verifyResend.success', {
                  defaultValue: 'We sent you a new verification link.',
                })
            );
            handleClose();
          },
          onError: (err: any) => {
            if (handleRateLimit(err, toast, t, 'rateLimit.verifyResend.cooldown')) {
              return;
            }
            const msg =
              err?.response?.data?.message ||
              t('auth.dialogs.verifyResend.failure', {
                defaultValue: 'Failed to resend verification email.',
              });
            toast.error(msg);
          },
        }
      );
    }
  };

  if (!open) return null;

  return (
    <Dialog
      header={
        <span>
          {t('auth.dialogs.verifyResend.header', { defaultValue: 'Email verification required' })}
        </span>
      }
      visible={open}
      modal
      dismissableMask
      closable
      width={480}
      maxWidth={'90%'}
      onHide={handleClose}
      footer={
        <Flex justify="end" spacing="s">
          <Button appearance="link" onClick={handleClose} isDisabled={isPending || isPendingEmail}>
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button onClick={handleResend} isLoading={isPending || isPendingEmail}>
            {t('auth.dialogs.verifyResend.resend', { defaultValue: 'Resend verification email' })}
          </Button>
        </Flex>
      }
    >
      <div>
        {t('auth.dialogs.verifyResend.body', {
          defaultValue: 'Your email is not verified. The verification link may have expired.',
        })}
      </div>
    </Dialog>
  );
};

export default VerificationResendDialog;
