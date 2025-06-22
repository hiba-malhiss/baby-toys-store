import React, { type MouseEventHandler } from 'react';
import styles from './button.module.scss';
import clsx from 'clsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Icon } from '../Icon/Icon.tsx';

export type ButtonSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
type ButtonProps = {
  children?: React.ReactNode;
  appearance?: 'link' | 'filled' | 'outline';
  color?: 'primary' | 'accent' | 'secondary' | 'light' | 'icon' | 'highlighted';
  size?: ButtonSize;
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
  isRounded?: boolean;
  withoutPadding?: boolean;
  withoutAutoHeight?: boolean;
  isSelected?: boolean;
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
    withoutPadding && styles.buttonNoPadding,
    withoutAutoHeight && styles.buttonAutoHeight,
    isSelected && styles.isSelected,
    children && styles.buttonWithText,
    className
  );

  return (
    <button className={calculatedClassName} onClick={onClick} disabled={isDisabled}>
      {leftIcon && <Icon icon={leftIcon} className={styles.buttonIcon} size={size} color={null} />}
      {children}
      {rightIcon && (
        <Icon icon={rightIcon} className={styles.buttonIcon} size={size} color={null} />
      )}
    </button>
  );
};
