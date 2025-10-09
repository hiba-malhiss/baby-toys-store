import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { StringInput, Button, Flex, Heading, Card, useToast } from '@baby-toys/ui-kit';
import { useLogin, useLogout, USER_ROLE } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import styles from './login-page.module.scss';
import { setAccessToken } from '../../api/axiosConfig.ts';

// Zod schema for validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const { user, isInitializing } = useAuth();

  const { control, handleSubmit, formState } = useForm<LoginFormData>({
    mode: 'onBlur',
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      // Backend must enforce role security
      if (response?.role !== USER_ROLE.ADMIN) {
        toast.error('Access denied. Admin privileges required.');
        await logoutMutation.mutateAsync(); // clean cookies
        return;
      }
      setAccessToken(response.accessToken);
      toast.success(response.message || 'Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      // Better error handling for network/backend errors
      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your credentials and try again.';
      toast.error(message);
    }
  };

  const isSubmitting = formState.isSubmitting || loginMutation.isPending || isInitializing;

  useEffect(() => {
    if (user?.role === USER_ROLE.ADMIN) {
      navigate('/dashboard', { replace: true });
    }
  }, [user?.role, navigate]);

  return (
    <div className={styles.loginPage}>
      <Card className={styles.loginPageCard}>
        <Flex direction="vertical" spacing="m" className={styles.loginPageContainer}>
          <img src="/assets/kit-images/logo.png" alt="logo" className={styles.loginPageLogo} />
          <Heading tag="h1" align="center">
            Admin Login
          </Heading>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.loginPageLoginForm}>
            <Flex direction="vertical" spacing="m">
              <FormFieldWrapper name="email" control={control} label="Email" fullWidth>
                <StringInput
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="username"
                  isDisabled={isSubmitting}
                  fullWidth
                />
              </FormFieldWrapper>

              <FormFieldWrapper name="password" control={control} label="Password" fullWidth>
                <StringInput
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  isDisabled={isSubmitting}
                  fullWidth
                />
              </FormFieldWrapper>

              <Button
                type="submit"
                fullWidth
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                aria-label="Login to admin panel"
              >
                Login
              </Button>
            </Flex>
          </form>
        </Flex>
      </Card>
    </div>
  );
};

export default LoginPage;
