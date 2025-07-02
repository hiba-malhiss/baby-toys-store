import React from 'react';
import Flex from '../../common/Flex/Flex.tsx';
import { Button } from '../../common/Button/Button.tsx';
import LoginDialog from './LoginDialog.tsx';
import RegisterDialog from './RegisterDialog.tsx';
import { useLoginDialogStore } from '../../../store/useLoginDialogStore';
import { useAuth } from '../../../context/AuthContext';

const AuthButtonsWithDialogs: React.FC = () => {
  const { isOpen, open, close } = useLoginDialogStore();
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);
  const { isLoggedIn, logout } = useAuth();

  return (
    <>
      <Flex spacing="xxxxl">
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
      </Flex>
      <LoginDialog open={isOpen} onClose={close} />
      <RegisterDialog open={isRegisterOpen} onClose={() => setRegisterOpen(false)} />
    </>
  );
};

export default AuthButtonsWithDialogs;
