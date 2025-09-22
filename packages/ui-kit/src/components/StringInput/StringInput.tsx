import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './string-input.module.scss';
import Icon from '../Icon/Icon.tsx';
import Button from '../Button/Button.tsx';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../Tooltip/Tooltip.tsx';
import type { IconColor } from '../Icon/icon.constant.ts';

export type IconPosition = 'left' | 'right';
export type StringInputSize = 'small' | 'medium' | 'large';

export interface StringInputProps {
  type?: string;
  min?: string | number;
  max?: string | number;
  value?: string | number;
  onChange?: (val: string | number, byControls: boolean) => void;
  onBlur?: () => void;
  placeholder?: string;
  icon?: any;
  iconRight?: any;
  onIconClick?: (e: React.MouseEvent) => void;
  iconColor?: IconColor;
  className?: string;
  iconPosition?: IconPosition;
  // Render the icon container with a background (button-like look)
  withIconBackground?: boolean;
  maxTooltip?: React.ReactNode;
  isDisabled?: boolean;
  isRounded?: boolean;
  size?: StringInputSize;
  fullWidth?: boolean;
  hasError?: boolean;
  withControls?: boolean;
  readOnly?: boolean;
}

const StringInput: React.FC<StringInputProps> = ({
  className,
  type = 'text',
  min,
  max,
  value,
  onChange,
  placeholder = '',
  icon,
  iconRight,
  onIconClick,
  withIconBackground = false,
  iconColor,
  iconPosition = 'left',
  isDisabled = false,
  size = 'medium',
  fullWidth = false,
  isRounded = false,
  withControls = false,
  hasError,
  maxTooltip,
  onBlur,
  readOnly = false,
}) => {
  // Detect if controlled
  const isControlled = value !== undefined && onChange !== undefined;

  // Internal state only if uncontrolled
  const [internalValue, setInternalValue] = useState<string>(() => {
    if (!isControlled) {
      if (value === undefined || value === null) return '';
      return String(value);
    }
    return '';
  });

  // Sync internal state only when uncontrolled and value prop changes
  useEffect(() => {
    if (!isControlled) {
      const valStr = value === undefined || value === null ? '' : String(value);
      if (valStr !== internalValue) {
        setInternalValue(valStr);
      }
    }
  }, [value, isControlled]);

  const [showMaxTooltip, setShowMaxTooltip] = useState(false);

  // Resolve icon props for backward compatibility
  const resolvedIcon = iconRight ?? icon;
  const resolvedIconPosition: IconPosition = iconRight ? 'right' : iconPosition;

  const handleChange = (newVal: string, byControls: boolean = false) => {
    if (!isControlled) {
      setInternalValue(newVal);
    }

    if (type === 'number') {
      const trimmed = newVal.trim();
      if (trimmed === '') {
        // Emit null for cleared numeric inputs
        onChange?.(null as any);
        return;
      }
      const parsed = parseFloat(trimmed);
      if (!isNaN(parsed)) {
        onChange?.(parsed as any);
      } else {
        // Keep previous behavior for other non-numeric cases
        onChange?.(NaN as any);
      }
    } else {
      onChange?.(newVal as any);
    }
  };

  const handleStep = (step: number) => {
    if (isDisabled) return;

    // Determine current value: controlled ? value : internalValue
    const currentValue = isControlled ? String(value ?? '') : internalValue;
    const current = parseFloat(currentValue || String(min ?? '0'));
    const next = current + step;

    const minVal = min !== undefined ? parseFloat(String(min)) : undefined;
    const maxVal = max !== undefined ? parseFloat(String(max)) : undefined;

    const isMax = maxVal !== undefined && current === maxVal;

    if (step > 0 && isMax && maxTooltip) {
      setShowMaxTooltip(true);
      setTimeout(() => setShowMaxTooltip(false), 1500);
      return;
    }

    if (minVal !== undefined && next < minVal) return;
    if (maxVal !== undefined && next > maxVal) return;

    handleChange(next.toString(), true);
  };

  const containerClass = clsx(
    styles.stringInput,
    styles[`stringInput--${size}Size`],
    styles[`stringInput--${resolvedIconPosition}Icon`],
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
    styles[`${size}Size-${resolvedIconPosition}Icon`],
    {
      [styles.isDisabled]: isDisabled,
      [styles.hasIcon]: resolvedIcon,
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
              e.preventDefault();
              e.stopPropagation();
              handleStep(-1);
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
          readOnly={readOnly}
          placeholder={placeholder}
          value={isControlled ? String(value ?? '') : internalValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={onBlur}
          className={clsx(inputClass)}
        />

        {type === 'number' && withControls && (
          <Tooltip content={maxTooltip} position="top" mode="manual" open={showMaxTooltip}>
            <Button
              appearance="link"
              color="primary"
              size={size}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleStep(1);
              }}
              leftIcon={faPlus}
              isDisabled={isDisabled}
              className={styles.stringInputIncreaseControl}
            />
          </Tooltip>
        )}

        {resolvedIcon && (
          <div
            className={clsx(
              styles.icon,
              withIconBackground && styles.iconButton,
              withIconBackground && styles[`iconButton--${size}Size`]
            )}
            onClick={(e) => {
              if (isDisabled) return;
              if (onIconClick) {
                e.preventDefault();
                e.stopPropagation();
                onIconClick(e);
              }
            }}
            role={onIconClick ? 'button' : undefined}
            aria-disabled={isDisabled}
          >
            <Icon icon={resolvedIcon} className={clsx(styles.icon)} color={iconColor} size={size} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StringInput;
