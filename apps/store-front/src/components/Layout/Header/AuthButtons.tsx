import React from 'react';
import LoginDialog from './LoginDialog.tsx';
import RegisterDialog from './RegisterDialog.tsx';
import { Button } from '@baby-toys/ui-kit/components';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useLoginDialogStore } from '../../../store/useLoginDialogStore.ts';

const AuthButtonsWithDialogs: React.FC = () => {
  const { isOpen, open, close } = useLoginDialogStore();
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);
  const { isLoggedIn, logout } = useAuth();

  return (
    <>
      {!isLoggedIn ? (
        <>
          <Button withoutPadding appearance="link" color="light" onClick={open}>
            Login
          </Button>
          <Button
            withoutPadding
            appearance="link"
            color="light"
            onClick={() => setRegisterOpen(true)}
          >
            Register
          </Button>
        </>
      ) : (
        <Button withoutPadding appearance="link" color="light" onClick={logout}>
          Logout
        </Button>
      )}
      <LoginDialog open={isOpen} onClose={close} />
      <RegisterDialog open={isRegisterOpen} onClose={() => setRegisterOpen(false)} />
    </>
  );
};

export default AuthButtonsWithDialogs;
