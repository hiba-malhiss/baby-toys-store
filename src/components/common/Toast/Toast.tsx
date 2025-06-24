import styles from './toast.module.scss';
import { useToast } from './ToastContext';

export const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <strong>{toast.title}</strong>
          <p>{toast.message}</p>
          <button className={styles.closeButton} onClick={() => removeToast(toast.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
