import React from 'react';
import clsx from 'clsx';
import Icon from '../Icon/Icon.tsx';
import type { ComponentType } from 'react';
import { IconSize } from '../Icon/icon.constant.ts';
import styles from './social-icon-button.module.scss';

export type SocialIconVariant =
  | 'instagram'
  | 'whatsapp'
  | 'twitter'
  | 'facebook'
  | 'youtube'
  | 'telegram'
  | 'github'
  | 'default';

export type SocialIconButtonSize = 'small' | 'medium' | 'large';

export interface SocialIconButtonProps {
  icon: ComponentType<any>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: SocialIconVariant;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: SocialIconButtonSize;
  useVariantOverlay?: boolean;
}

const SocialIconButton: React.FC<SocialIconButtonProps> = ({
  icon,
  onClick,
  variant,
  ariaLabel,
  className,
  disabled = false,
  type = 'button',
  size = 'medium',
  useVariantOverlay = false,
}) => {
  const resolvedVariant = variant ?? 'default';
  const sizeClass = styles[`socialButton--size-${size}`] ?? styles['socialButton--size-medium'];
  const iconSize =
    size === 'small' ? IconSize.small : size === 'large' ? IconSize.large : IconSize.medium;

  return (
    <button
      type={type}
      className={clsx(
        styles.socialButton,
        styles[`socialButton--${resolvedVariant}`],
        useVariantOverlay && styles['socialButton--variant-overlay'],
        sizeClass,
        className,
        {
          [styles.isDisabled]: disabled,
        }
      )}
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      <span className={styles.socialButtonInner}>
        <Icon icon={icon} size={iconSize} />
      </span>
    </button>
  );
};

export default SocialIconButton;
