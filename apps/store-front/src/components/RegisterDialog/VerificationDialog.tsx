import React from 'react';
import { Dialog, Button } from '@baby-toys/ui-kit/components';
import { faCheckCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import styles from './VerificationDialog.module.scss';
import { Icon, IconColor, IconSize } from "@baby-toys/ui-kit/components";

interface VerificationDialogProps {
  visible: boolean;
  email: string;
  onClose: () => void;
}

const VerificationDialog = ({
                              visible,
                              email,
                              onClose,
                            }
                              :
                              VerificationDialogProps
  ) => {
    return (
      <Dialog
        visible={visible}
        onHide={onClose}
        header="Verify Your Email"
      >
        <div className={styles.content}>
          <Icon icon={faCheckCircle} color={IconColor.success} size={IconSize.xxlarge}/>
          <p className={styles.successText}>Registration Successful!</p>
          <p className={styles.message}>
            <Icon icon={faEnvelope} color={IconColor.gray}/>
            We've sent a verification link to <span className={styles.emailText}>{email}</span>.
            Please check your inbox and click the link to verify your email address.
          </p>
          <p className={styles.hint}>
            Didn't receive the email? Check your spam folder.
          </p>
          <Button onClick={onClose} className={styles.closeBtn}>Close</Button>
        </div>

      </Dialog>
    );
  }
;

export default React.memo(VerificationDialog);
