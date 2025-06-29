import React, { useState } from 'react';
import Flex from '../../common/Flex/Flex.tsx';
import { Button } from '../../common/Button/Button.tsx';
import LoginDialog from './LoginDialog.tsx';
import RegisterDialog from './RegisterDialog.tsx';

const AuthButtonsWithDialogs: React.FC = () => {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

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

      <LoginDialog open={isLoginOpen} onClose={() => setLoginOpen(false)} />

      <RegisterDialog open={isRegisterOpen} onClose={() => setRegisterOpen(false)} />
    </>
  );
};

export default AuthButtonsWithDialogs;
