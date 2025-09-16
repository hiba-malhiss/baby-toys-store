import React from 'react';
import { Button } from '@baby-toys/ui-kit/components';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useLoginDialogStore } from '../../../store/useLoginDialogStore.ts';
import RegisterDialog from '../../RegisterDialog/RegisterDialog.tsx';
import LoginDialog from '../../LoginDialog/LoginDialog.tsx';

const AuthButtonsWithDialogs: React.FC<{ isDarkMode?: boolean; onAfterClick?: () => void }> = ({
  isDarkMode,
  onAfterClick,
}) => {
  const { isOpen, open, close } = useLoginDialogStore();
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);
  const { isAuthenticated, logout } = useAuth();

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
            Login
          </Button>
          <Button
            withoutPadding
            appearance="link"
            color={isDarkMode ? 'light' : 'primary'}
            onClick={() => {
              setRegisterOpen(true);
              onAfterClick?.();
            }}
          >
            Register
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
          Logout
        </Button>
      )}
      <LoginDialog open={isOpen} onClose={close} />
      <RegisterDialog open={isRegisterOpen} onClose={() => setRegisterOpen(false)} />
    </>
  );
};

export default AuthButtonsWithDialogs;
