import React from 'react';
import styles from './checkbox.module.scss';
import clsx from 'clsx';

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  isDisabled?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  isDisabled = false,
  className,
}) => {
  const handleChange = () => {
    if (!isDisabled) {
      onChange?.(!checked);
    }
  };

  return (
    <label className={clsx(styles.checkbox, className, isDisabled && styles['checkbox--disabled'])}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={isDisabled}
        className={styles.checkbox__input}
      />
      <span className={styles.checkbox__checkmark}></span>
      {label && <span className={styles.checkbox__label}>{label}</span>}
    </label>
  );
};

export default Checkbox;
