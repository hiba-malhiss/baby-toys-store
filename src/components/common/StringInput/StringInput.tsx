import React, { useRef } from 'react';
import clsx from 'clsx';
import styles from './string-input.module.scss';
import { Icon } from '../Icon/Icon.tsx';

export type IconPosition = 'left' | 'right';
export type StringInputSize = 'small' | 'medium' | 'large';

interface StringInputProps {
  type?: string;
  min?: string;
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  icon?: any;
  iconColor?: string;
  className?: string;
  iconPosition?: IconPosition;
  isDisabled?: boolean;
  withIconBackground?: boolean;
  isRounded?: boolean;
  size?: StringInputSize;
  fullWidth?: boolean;
  hasError?: boolean;
}

export const StringInput: React.FC<StringInputProps> = ({
  className,
  type = 'text',
  min,
  value,
  onChange,
  placeholder = '',
  icon,
  iconColor,
  iconPosition = 'left',
  isDisabled = false,
  size = 'medium',
  fullWidth = false,
  hasError = false,
  isRounded = false,
  withIconBackground = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const containerClass = clsx(
    styles.stringInput,
    styles[`stringInput--${size}Size`],
    styles[`stringInput--${iconPosition}Icon`],
    isRounded && styles.isRounded,
    {
      [styles.stringInputFullWidth]: fullWidth,
    }
  );

  const inputClass = clsx(
    styles.input,
    className,
    styles[`input--${size}Size`],
    styles[`${size}Size-${iconPosition}Icon`],
    {
      [styles.isDisabled]: isDisabled,
      [styles.hasIcon]: icon,
      [styles.hasError]: hasError,
    }
  );

  return (
    <div className={containerClass}>
      <input
        ref={inputRef}
        type={type}
        min={min}
        step="any"
        disabled={isDisabled}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={inputClass}
      />
      {icon && (
        <Icon
          icon={icon}
          className={clsx(withIconBackground && styles.iconFilled, styles.icon)}
          color={iconColor}
          size={size}
        />
      )}
    </div>
  );
};
