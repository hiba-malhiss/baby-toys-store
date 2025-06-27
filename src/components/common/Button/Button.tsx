import React, { type MouseEventHandler } from 'react';
import styles from './button.module.scss';
import clsx from 'clsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Icon } from '../Icon/Icon.tsx';

export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
export type ButtonColor =
  | 'primary'
  | 'accent'
  | 'secondary'
  | 'light'
  | 'icon'
  | 'highlighted'
  | 'secondary-light';
type ButtonProps = {
  children?: React.ReactNode;
  appearance?: 'link' | 'filled' | 'outline';
  color?: ButtonColor;
  size?: ButtonSize;
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
  isRounded?: boolean;
  withoutPadding?: boolean;
  withoutAutoHeight?: boolean;
  isSelected?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  appearance = 'filled',
  color = 'primary',
  size = 'medium',
  leftIcon,
  rightIcon,
  onClick,
  isDisabled = false,
  withoutAutoHeight = false,
  fullWidth = false,
  isRounded = false,
  withoutPadding,
  isSelected,
  className,
}) => {
  const calculatedClassName = clsx(
    styles.button,
    isRounded && styles.isRounded,
    styles['button--' + size + 'Size'],
    styles['button--' + color + 'Color'],
    styles['button--' + appearance + 'Appearance'],
    isDisabled && styles.isDisabled,
    fullWidth && styles.fullWidth,
    withoutPadding && styles.buttonNoPadding,
    withoutAutoHeight && styles.buttonAutoHeight,
    isSelected && styles.isSelected,
    children && styles.buttonWithText,
    className
  );

  return (
    <button className={calculatedClassName} onClick={onClick} disabled={isDisabled}>
      {leftIcon && <Icon icon={leftIcon} className={styles.buttonIcon} size={size} />}
      {children}
      {rightIcon && <Icon icon={rightIcon} className={styles.buttonIcon} size={size} />}
    </button>
  );
};
