import React from 'react';
import styles from './FieldWrapper.module.scss';

interface FieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({ label, error, children, className }) => (
  <div className={`${styles.fieldWrapper} ${className || ''}`}>
    <label className={styles.fieldWrapperLabel}>{label}</label>
    {children}
    {error && <div className={styles.fieldWrapperErrorMessage}>{error}</div>}
  </div>
);

export default FieldWrapper;
