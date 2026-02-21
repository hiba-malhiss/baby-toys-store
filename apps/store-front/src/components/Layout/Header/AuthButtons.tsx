import React, { useCallback } from 'react';
import { Button, Flex } from '@baby-toys/ui-kit';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useLoginDialogStore } from '../../../store/useLoginDialogStore.ts';
import RegisterDialog from '../../RegisterDialog/RegisterDialog.tsx';
import LoginDialog from '../../LoginDialog/LoginDialog.tsx';
import VerificationResendDialog from '../../VerificationResendDialog.tsx';
import { useLogout } from '../../../api/authApi.ts';
import { useTranslation } from 'react-i18next';

const AuthButtonsWithDialogs: React.FC<{
  isDarkMode?: boolean;
  isLink?: boolean;
  onAfterClick?: () => void;
}> = ({
  isDarkMode,
  onAfterClick,

  isLink = true,
}) => {
  const { isOpen, open, close } = useLoginDialogStore();
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();
  const { mutateAsync: logoutApi } = useLogout();
  const { t } = useTranslation('common');

  const logout = useCallback(async () => {
    try {
      await logoutApi();
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Logout failed:', error);
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [logoutApi]);

  return (
    <Flex spacing={!isLink && 's'} align="center">
      {!isAuthenticated ? (
        <>
          <Button
            withoutPadding
            fullWidth={!isLink}
            appearance={isLink ? 'link' : 'outline'}
            color={isDarkMode ? 'light' : 'primary'}
            onClick={() => {
              open();
              onAfterClick?.();
            }}
          >
            {t('auth.login')}
          </Button>
          {isDarkMode && <div>|</div>}
          <Button
            withoutPadding
            fullWidth={!isLink}
            appearance={isLink ? 'link' : 'filled'}
            color={isDarkMode ? 'light' : 'primary'}
            onClick={() => {
              setRegisterOpen(true);
              onAfterClick?.();
            }}
          >
            {t('auth.register')}
          </Button>
        </>
      ) : (
        <Button
          withoutPadding
          fullWidth={!isLink}
          appearance={isLink ? 'link' : 'outline'}
          color={isDarkMode ? 'light' : 'primary'}
          onClick={() => {
            logout();
            onAfterClick?.();
          }}
        >
          {t('auth.logout')}
        </Button>
      )}
      <LoginDialog open={isOpen} onClose={close} />
      <RegisterDialog open={isRegisterOpen} onClose={() => setRegisterOpen(false)} />
      <VerificationResendDialog />
    </Flex>
  );
};

export default AuthButtonsWithDialogs;
