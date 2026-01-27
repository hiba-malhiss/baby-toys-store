import { forwardRef, type MouseEventHandler, type ReactNode } from 'react';
import styles from './button.module.scss';
import clsx from 'clsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Icon from '../Icon/Icon.tsx';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { IconColor } from '../Icon/icon.constant.ts';

export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
export type ButtonAppearance = 'link' | 'filled' | 'outline';
export type ButtonColor =
  | 'primary'
  | 'accent'
  | 'secondary'
  | 'light'
  | 'icon'
  | 'highlighted'
  | 'underline'
  | 'error'
  | 'secondary-light';

type ButtonProps = {
  children?: ReactNode;
  appearance?: ButtonAppearance;
  color?: ButtonColor;
  size?: ButtonSize;
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
  isRounded?: boolean;
  iconColor?: IconColor;
  withoutPadding?: boolean;
  withAutoHeight?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  iconBadge?: string;
  align?: string;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      appearance = 'filled',
      color = 'primary',
      size = 'medium',
      leftIcon,
      rightIcon,
      onClick,
      isDisabled = false,
      isLoading = false,
      withAutoHeight = false,
      fullWidth = false,
      isRounded = false,
      withoutPadding,
      isSelected,
      className,
      align,
      iconColor,
      iconBadge,
      type,
      form,
      ...rest
    },
    ref
  ) => {
    const resolvedDisabled = !!isDisabled;
    const resolvedLoading = !!isLoading;
    const resolvedFullWidth = !!fullWidth;
    const resolvedType = type ?? 'button';

    const calculatedClassName = clsx(
      styles.button,
      isRounded && styles.isRounded,
      styles['button--' + size + 'Size'],
      styles['button--' + color + 'Color'],
      styles['button--' + appearance + 'Appearance'],
      align && styles['button--' + align + 'Align'],
      resolvedDisabled && styles.isDisabled,
      resolvedFullWidth && styles.fullWidth,
      withoutPadding && styles.buttonNoPadding,
      withAutoHeight && styles.buttonAutoHeight,
      isSelected && styles.isSelected,
      children && styles.buttonWithText
    );

    return (
      <div className={clsx(className)}>
        <button
          ref={ref}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onClick && onClick(e);
            }
          }}
          className={calculatedClassName}
          onClick={onClick}
          disabled={resolvedDisabled || resolvedLoading}
          type={resolvedType}
          form={form}
          {...rest}
        >
          {/* Loading icon (does NOT replace content) */}
          {resolvedLoading && (
            <Icon
              isSpinning
              icon={faSpinner}
              className={clsx(styles.buttonIcon, styles.loadingIcon)}
              size={size}
            />
          )}

          {leftIcon && (
            <Icon
              color={iconColor}
              icon={leftIcon}
              className={styles.buttonIcon}
              size={size}
              badge={iconBadge}
            />
          )}

          {children}

          {rightIcon && (
            <Icon
              color={iconColor}
              icon={rightIcon}
              className={styles.buttonIcon}
              size={size}
              badge={iconBadge}
            />
          )}
        </button>
      </div>
    );
  }
);

export default Button;
