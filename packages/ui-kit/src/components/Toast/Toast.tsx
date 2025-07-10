import styles from './toast.module.scss';
import { useToast } from './ToastContext';
import Button from '../Button/Button.tsx';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message: string;
};

const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div key={toast.id} className={clsx(styles.toast, styles['toast-' + toast.type])}>
          {toast.title && <strong>{toast.title}</strong>}
          {toast.message && <p>{toast.message}</p>}
          <Button
            appearance="link"
            leftIcon={faClose}
            className={styles.toastCloseButton}
            onClick={() => removeToast(toast.id)}
            withoutPadding
            size="xsmall"
          />
        </div>
      ))}
    </div>
  );
};

export default Toast;
