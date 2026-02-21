import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@baby-toys/ui-kit';
import { useVerifyEmail } from '../../api/authApi';
import styles from './VerifyEmailPage.module.scss';
import { BouncingDotsLoader } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { t } = useTranslation('common');

  const { isPending, isError, isSuccess, data } = useVerifyEmail(token);

  // Handle successful verification
  useEffect(() => {
    if (isSuccess && data) {
      navigate('/', {
        state: {
          showToast: true,
          toastMessage: data.message || t('auth.verifyEmail.success'),
          toastType: 'success',
        },
      });
    }
  }, [isSuccess, data, navigate]);

  // If token is invalid/expired, redirect to home and show the resend dialog
  useEffect(() => {
    if (isError && token) {
      navigate('/', {
        replace: true,
        state: {
          showVerifyDialog: true,
          verifyToken: token,
        },
      });
    }
  }, [isError, token, navigate]);

  if (!token) {
    return (
      <div className={styles.verifyEmailPage}>
        <div className={styles.verifyEmailPageError}>{t('auth.verifyEmail.invalidLink')}</div>
        <Button onClick={() => navigate('/')}>{t('auth.verifyEmail.goHome')}</Button>
      </div>
    );
  }

  return (
    <div className={styles.verifyEmailPage}>
      {isPending && (
        <>
          <BouncingDotsLoader />
          <div className={styles.verifyEmailPageLoading}>{t('auth.verifyEmail.verifying')}</div>
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;
