import React, { type ReactNode } from 'react';
import styles from './radio-button.module.scss';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon.tsx';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface RadioButtonProps {
  name?: string;
  children: ReactNode;
  value: string;
  isSelected?: boolean;
  onChange?: (value: string) => void;
  appearance?: 'link' | 'secondary' | 'link-underline' | 'field';
  className?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  children,
  value,
  isSelected,
  onChange,
  className,
  appearance = 'field',
}) => {
  return (
    <label
      htmlFor={`${name}-${value}`}
      className={clsx(className, styles.radioButton, styles[`radioButton--${appearance}`], {
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
      {appearance === 'field' && (
        <span className={styles.radioButtonBox}>
          <Icon icon={faCheck} size="xsmall" />
        </span>
      )}
      {children}
    </label>
  );
};

export default RadioButton;
