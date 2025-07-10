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
    <div className={styles.cardContainer}>
      <Card className={styles.card} fullHeight>
        <Flex className={styles.flexContainer} spacing="s">
          <img src="/assets/images/logo.png" alt="logo" className={styles.logo} />
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
          <Button className={styles.button} onClick={handleLogin} fullWidth>
            Login
          </Button>
        </Flex>
      </Card>
    </div>
  );
};

export default LoginPage;
