import React, { useCallback } from 'react';
import { Button } from '@baby-toys/ui-kit';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useLoginDialogStore } from '../../../store/useLoginDialogStore.ts';
import RegisterDialog from '../../RegisterDialog/RegisterDialog.tsx';
import LoginDialog from '../../LoginDialog/LoginDialog.tsx';
import { useLogout } from '../../../api/authApi.ts';
import { useTranslation } from 'react-i18next';

const AuthButtonsWithDialogs: React.FC<{ isDarkMode?: boolean; onAfterClick?: () => void }> = ({
  isDarkMode,
  onAfterClick,
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
    <>
      {!isAuthenticated ? (
        <>
          <Button
            withoutPadding
            appearance="link"
            color={isDarkMode ? 'light' : 'primary'}
            onClick={() => {
              open();
              onAfterClick?.();
            }}
          >
            {t('auth.login')}
          </Button>
          <div>|</div>
          <Button
            withoutPadding
            appearance="link"
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
          appearance="link"
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
    </>
  );
};

export default AuthButtonsWithDialogs;
