import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@baby-toys/ui-kit';
import { useVerifyEmail } from '../../api/authApi';
import styles from './VerifyEmailPage.module.scss';
import { BouncingDotsLoader } from '@baby-toys/ui-kit';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const {
    isPending,
    isError,
    error,
    isSuccess,
    data
  } = useVerifyEmail(token);

  // Handle successful verification
  useEffect(() => {
    if(isSuccess && data) {
      navigate('/', {
        state: {
          showToast: true,
          toastMessage: data.message || 'Email verified successfully! You can now log in.',
          toastType: 'success',
        },
      });
    }
  }, [isSuccess, data, navigate]);

  if(!token) {
    return (
      <div className={styles.verifyEmailPage}>
        <div className={styles.verifyEmailPageError}>Invalid or expired verification link</div>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  return (
    <div className={styles.verifyEmailPage}>
      {isPending && (
        <>
          <BouncingDotsLoader/>
          <div className={styles.verifyEmailPageLoading}>Verifying your email...</div>
        </>
      )}

      {(isError) && (
        <>
          <div className={styles.verifyEmailPageError}>Verification Failed</div>
          <div className={styles.verifyEmailPageErrorMessage}>
            {(error as any)?.response?.message || 'Failed to verify email. The link may have expired or is invalid.'}
          </div>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;
