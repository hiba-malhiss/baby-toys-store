import React from 'react';
import clsx from 'clsx';
import Icon from '../Icon/Icon.tsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
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
  icon: IconDefinition;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: SocialIconVariant;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: SocialIconButtonSize;
  useVariantOverlay?: boolean;
}

const iconNameToVariant: Record<string, SocialIconVariant> = {
  instagram: 'instagram',
  whatsapp: 'whatsapp',
  twitter: 'twitter',
  'facebook-f': 'facebook',
  youtube: 'youtube',
  telegram: 'telegram',
  github: 'github',
};

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
  const resolvedVariant =
    variant ?? iconNameToVariant[icon.iconName ?? ''] ?? ('default' as SocialIconVariant);
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

