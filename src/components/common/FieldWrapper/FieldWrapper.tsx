import React from 'react';
import styles from './FieldWrapper.module.scss';

interface FieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  required?: boolean;
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  error,
  children,
  className,
  fullWidth,
  required,
}) => (
  <div
    className={`${styles.fieldWrapper} ${className || ''} ${fullWidth && styles.fullWidth} ${required && styles.isRequired}`}
  >
    <label className={styles.fieldWrapperLabel}>{label}</label>
    {children}
    {error && <div className={styles.fieldWrapperErrorMessage}>{error}</div>}
  </div>
);

export default FieldWrapper;
