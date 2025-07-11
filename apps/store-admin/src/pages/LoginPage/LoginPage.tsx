import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StringInput, Button, Flex, Heading, Card } from '@baby-toys/ui-kit/components';
import { useAuth } from '../../context/AuthContext.tsx';
import styles from './login-page.module.scss';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(username, password).then(() => {
      navigate('/dashboard');
    });
  };

  return (
    <div className={styles.loginPage}>
      <Card className={styles.loginPageCard} fullHeight>
        <Flex className={styles.loginPageContainer} spacing="s">
          <img src="/assets/images/logo.png" alt="logo" className={styles.loginPageLogo} />
          <Heading tag="h1">Login</Heading>
          <StringInput
            fullWidth
            placeholder="Username"
            value={username}
            onChange={(value) => setUsername(value as string)}
          />
          <StringInput
            fullWidth
            placeholder="Password"
            type="password"
            value={password}
            onChange={(value) => setPassword(value as string)}
          />
          <Button onClick={handleLogin} fullWidth>
            Login
          </Button>
        </Flex>
      </Card>
    </div>
  );
};

export default LoginPage;
