import React from 'react';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon.tsx';
import { Button } from '../Button/Button.tsx';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Flex from '../Flex/Flex.tsx';
import styles from './alert.module.scss';

export type AlertAppearance = 'info' | 'success' | 'warning' | 'error' | 'flash-sale';
export type AlertSize = 'small' | 'medium' | 'large';

interface AlertProps {
  appearance?: AlertAppearance;
  size?: AlertSize;
  title?: string;
  message?: string;
  icon?: any;
  onClose?: () => void;
  closable?: boolean;
  className?: string;
  children?: React.ReactNode;
  countdown?: string;
  isAnimated?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  appearance = 'info',
  size = 'medium',
  title,
  message,
  icon,
  onClose,
  closable = false,
  className,
  children,
  countdown,
  isAnimated = false,
}) => {
  const alertClass = clsx(
    styles.alert,
    styles[`alert--${appearance}`],
    styles[`alert--${size}`],
    appearance === 'flash-sale' && isAnimated && styles['alert--animated'],
    className
  );

  return (
    <div className={alertClass} role="alert">
      <Flex spacing="s" fullWidth align="start" className={styles.alertContent}>
        {icon && (
          <div className={styles.alertIcon}>
            <Icon icon={icon} size={size} />
          </div>
        )}

        <div className={styles.alertText}>
          {title && <div className={styles.alertTitle}>{title}</div>}
          <div className={styles.alertMessage}>{message}</div>
          {countdown && (
            <div className={styles.alertCountdown}>
              Ends in: <span className={styles.countdownTime}>{countdown}</span>
            </div>
          )}
          {children}
        </div>

        {closable && onClose && (
          <Button
            appearance="link"
            size="small"
            onClick={onClose}
            leftIcon={faTimes}
            className={styles.alertCloseButton}
            aria-label="Close alert"
          />
        )}
      </Flex>
    </div>
  );
};
