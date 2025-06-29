import React, { useState } from 'react';
import Flex from '../../common/Flex/Flex.tsx';
import { Button } from '../../common/Button/Button.tsx';
import LoginDialog from '../../common/Dialog/LoginDialog.tsx';
import RegisterDialog from '../../common/Dialog/RegisterDialog.tsx';

const AuthButtonsWithDialogs: React.FC = () => {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  const handleLogin = (user: { email: string }) => {
    console.log('Logged in user:', user);
    setLoginOpen(false);
  };

  const handleRegister = (user: { email: string }) => {
    console.log('Registered user:', user);
    setRegisterOpen(false);
  };

  return (
    <>
      <Flex spacing="xxxxl">
        <Button withoutPadding appearance="link" color="light" onClick={() => setLoginOpen(true)}>
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
      </Flex>

      <LoginDialog open={isLoginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />

      <RegisterDialog
        open={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
        onRegister={handleRegister}
      />
    </>
  );
};

export default AuthButtonsWithDialogs;
