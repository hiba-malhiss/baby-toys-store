import React from 'react';
import { Dialog, Button, Icon, IconColor, IconSize } from '@baby-toys/ui-kit/components';
import { faCheckCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import styles from './VerificationDialog.module.scss';

interface VerificationDialogProps {
  visible: boolean;
  email: string;
  onClose: () => void;
  variant: 'register' | 'password';
}

const VERIFICATION_COPY: Record<VerificationDialogProps['variant'],
  {
    title: string;
    heading: string;
    messagePrefix: string;
    hint: string;
  }
> = {
  register: {
    title: 'Verify Your Email',
    heading: 'Registration Successful!',
    messagePrefix:
      'We\'ve sent a verification link to ',
    hint: 'Didn\'t receive the email? Check your spam folder.',
  },
  password: {
    title: 'Check Your Email',
    heading: 'Reset Link Sent!',
    messagePrefix:
      'We’ve emailed a password-reset link to ',
    hint: 'Didn’t get the email? Check your spam or try again.',
  },
};

const VerificationDialog: React.FC<VerificationDialogProps> = ({
 visible,
 email,
 onClose,
 variant,
}) => {
  const copy = VERIFICATION_COPY[variant];

  return (
    <Dialog
      visible={visible}
      onHide={onClose}
      header={copy.title}
    >
      <div className={styles.content}>
        <Icon icon={faCheckCircle} color={IconColor.success} size={IconSize.xxlarge} />
        <p className={styles.successText}>{copy.heading}</p>

        <p className={styles.message}>
          <Icon icon={faEnvelope} color={IconColor.gray} />
          {copy.messagePrefix}
          <span className={styles.emailText}>{email}</span>.
          Please check your inbox and click the link to continue.
        </p>

        <p className={styles.hint}>{copy.hint}</p>

        <Button onClick={onClose} className={styles.closeBtn}>
          Close
        </Button>
      </div>
    </Dialog>
  );
};

export default React.memo(VerificationDialog);
