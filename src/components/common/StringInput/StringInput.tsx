import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './string-input.module.scss';
import { Icon } from '../Icon/Icon.tsx';
import { Button } from '../Button/Button.tsx';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import type { IconColor } from '../Icon/icon.constant.ts';

export type IconPosition = 'left' | 'right';
export type StringInputSize = 'small' | 'medium' | 'large';

export interface StringInputProps {
  type?: string;
  min?: string | number;
  max?: string | number;
  value?: string | number;
  onChange?: (val: string | number) => void;
  placeholder?: string;
  icon?: any;
  iconColor?: IconColor;
  className?: string;
  iconPosition?: IconPosition;
  maxTooltip?: React.ReactNode;
  isDisabled?: boolean;
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
  max,
  value,
  onChange,
  placeholder = '',
  icon,
  iconColor,
  iconPosition = 'left',
  isDisabled = false,
  size = 'medium',
  fullWidth = false,
  isRounded = false,
  withControls = false,
  hasError,
  maxTooltip,
}) => {
  const [showMaxTooltip, setShowMaxTooltip] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(() => {
    if (value === undefined || value === null) return '';
    return String(value);
  });

  useEffect(() => {
    const valStr = value === undefined || value === null ? '' : String(value);
    if (valStr !== internalValue) {
      setInternalValue(valStr);
    }
  }, [value]);

  const handleChange = (newVal: string) => {
    setInternalValue(newVal);

    if (type === 'number') {
      // Try to parse as number
      const parsed = parseFloat(newVal);
      if (!isNaN(parsed)) {
        onChange?.(parsed);
      } else {
        // If empty or invalid number, pass NaN or empty string (optional)
        onChange?.(newVal === '' ? '' : NaN);
      }
    } else {
      onChange?.(newVal);
    }
  };

  const handleStep = (step: number) => {
    if (isDisabled) return;

    const current = parseFloat(internalValue || String(min ?? '0'));
    const next = current + step;

    const minVal = min !== undefined ? parseFloat(String(min)) : undefined;
    const maxVal = max !== undefined ? parseFloat(String(max)) : undefined;

    const isMax = maxVal !== undefined && current === maxVal;

    if (step > 0 && isMax && maxTooltip) {
      setShowMaxTooltip(true);
      setTimeout(() => setShowMaxTooltip(false), 1500); // Auto-hide after 1.5s
      return;
    }

    if (minVal !== undefined && next < minVal) return;
    if (maxVal !== undefined && next > maxVal) return;

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
    styles[`input--${size}Size`],
    styles[`${size}Size-${iconPosition}Icon`],
    {
      [styles.isDisabled]: isDisabled,
      [styles.hasIcon]: icon,
      [styles.hasError]: !!hasError,
    }
  );

  return (
    <div className={clsx(className, fullWidth && styles.fullWidth)}>
      <div className={containerClass}>
        {type === 'number' && withControls && (
          <Button
            appearance="link"
            color="primary"
            size={size}
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
          max={max}
          step="any"
          disabled={isDisabled}
          placeholder={placeholder}
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          className={clsx(inputClass)}
        />

        {type === 'number' && withControls && (
          <Tooltip content={maxTooltip} position="top" mode="manual" open={showMaxTooltip}>
            <Button
              appearance="link"
              color="primary"
              size={size}
              onClick={(e) => {
                handleStep(1);
                e.stopPropagation();
                e.preventDefault();
              }}
              leftIcon={faPlus}
              isDisabled={isDisabled}
              className={styles.stringInputIncreaseControl}
            />
          </Tooltip>
        )}

        {icon && <Icon icon={icon} className={clsx(styles.icon)} color={iconColor} size={size} />}
      </div>
    </div>
  );
};
