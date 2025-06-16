import React, { type ReactNode } from 'react';
import styles from './radio-button.module.scss';
import clsx from 'clsx';

interface RadioButtonProps {
  name?: string;
  children: ReactNode;
  value: string;
  isSelected?: boolean;
  onChange?: (value: string) => void;
  appearance?: 'link' | 'secondary';
}

export const appearanceClassMap = {
  secondary: styles.radioButtonSecondary,
  link: styles.radioButtonLink,
};

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  children,
  value,
  isSelected,
  onChange,
  appearance = 'secondary',
}) => {
  return (
    <label
      htmlFor={`${name}-${value}`}
      className={clsx(styles.radioButton, appearanceClassMap[appearance], {
        [styles.isSelected]: isSelected,
      })}
    >
      <input
        type="radio"
        id={`${name}-${value}`}
        name={name}
        value={value}
        checked={isSelected}
        onChange={() => onChange?.(value)}
      />
      {children}
    </label>
  );
};

export default RadioButton;
