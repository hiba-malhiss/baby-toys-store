import { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import type { Toast, ToastType } from './Toast.tsx';

type ToastContextType = {
  toasts: Toast[];
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Keep a map of timers so we can cancel/reset them
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Clear any pending timer for this toast
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const toast: Toast = { id, type, title, message: message ?? '' };

    setToasts((prev) => {
      // Deduplicate: if same title+type already visible, replace it
      const withoutDupe = prev.filter((t) => !(t.type === type && t.title === title));
      return [...withoutDupe, toast];
    });

    // Auto-dismiss after duration based on type
    const duration = type === 'error' ? 5000 : 3000;
    const timer = setTimeout(() => {
      timersRef.current.delete(id);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    timersRef.current.set(id, timer);
  }, []);

  const value: ToastContextType = {
    toasts,
    removeToast,
    success: (title: string, message?: string) => addToast('success', title, message),
    error: (title: string, message?: string) => addToast('error', title, message),
    info: (title: string, message?: string) => addToast('info', title, message),
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
