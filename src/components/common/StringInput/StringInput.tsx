import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './string-input.module.scss';
import { Icon } from '../Icon/Icon.tsx';
import { Button } from '../Button/Button.tsx';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

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
  withControls?: boolean;
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
  withControls = false,
}) => {
  const [internalValue, setInternalValue] = useState(value ?? min ?? '');

  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (newVal: string) => {
    setInternalValue(newVal);
    onChange?.(newVal);
  };

  const handleStep = (step: number) => {
    if (isDisabled) return;

    const current = parseFloat(internalValue || min || '0');
    const next = current + step;
    const minVal = min ? parseFloat(min) : undefined;

    if (typeof minVal === 'number' && next < minVal) return;

    handleChange(next.toString());
  };

  const containerClass = clsx(
    styles.stringInput,
    styles[`stringInput--${size}Size`],
    styles[`stringInput--${iconPosition}Icon`],
    isRounded && styles.isRounded,
    {
      [styles.stringWithControls]: withControls,
      [styles.stringInputFullWidth]: fullWidth,
      [styles.stringInputWithControls]: type === 'number' && withControls,
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
      {type === 'number' && withControls && (
        <Button
          appearance="link"
          color="secondary"
          onClick={(e) => {
            handleStep(-1);
            e.stopPropagation();
            e.preventDefault();
          }}
          leftIcon={faMinus}
          isDisabled={isDisabled}
          className={styles.stringInputDecreaseControl}
        />
      )}

      <input
        type={type}
        min={min}
        step="any"
        disabled={isDisabled}
        placeholder={placeholder}
        value={internalValue}
        onChange={(e) => handleChange(e.target.value)}
        className={inputClass}
      />

      {type === 'number' && withControls && (
        <Button
          appearance="link"
          color="secondary"
          onClick={(e) => {
            handleStep(1);
            e.stopPropagation();
            e.preventDefault();
          }}
          leftIcon={faPlus}
          isDisabled={isDisabled}
          className={styles.stringInputIncreaseControl}
        />
      )}

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
