import React from 'react';
import { Dialog, Button, Icon, IconColor, IconSize } from '@baby-toys/ui-kit';
import { CheckCircle, Mail } from 'lucide-react';
import styles from './VerificationDialog.module.scss';
import { useTranslation } from 'react-i18next';

interface VerificationDialogProps {
  visible: boolean;
  email: string;
  onClose: () => void;
  variant: 'register' | 'password';
}

const VerificationDialog: React.FC<VerificationDialogProps> = ({
  visible,
  email,
  onClose,
  variant,
}) => {
  const { t } = useTranslation('common');
  const base = `auth.dialogs.verification.${variant}` as const;

  return (
    <Dialog visible={visible} onHide={onClose} header={t(`${base}.title`)}>
      <div className={styles.content}>
        <Icon icon={CheckCircle} color={IconColor.success} size={IconSize.xxlarge} />
        <p className={styles.successText}>{t(`${base}.heading`)}</p>

        <p className={styles.message}>
          <Icon icon={Mail} color={IconColor.gray} />
          {t(`${base}.messagePrefix`)}
          <span className={styles.emailText}>{email}</span>.
          {t('auth.dialogs.verification.inboxPrompt')}
        </p>

        <p className={styles.hint}>{t(`${base}.hint`)}</p>

        <Button onClick={onClose} className={styles.closeBtn}>
          {t('auth.dialogs.verification.close')}
        </Button>
      </div>
    </Dialog>
  );
};

export default React.memo(VerificationDialog);
