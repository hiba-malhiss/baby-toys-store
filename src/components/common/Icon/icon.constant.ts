import styles from './icon.module.scss';

export enum IconColor {
  primary = 'primary',
  ternary = 'ternary',
  light = 'light',
  dark = 'dark',
  gray = 'gray',
  warning = 'warning',
  info = 'info',
  success = 'success',
}

export enum IconSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
  xlarge = 'xlarge',
  xxlarge = 'xxlarge',
  xxxlarge = 'xxxlarge',
}

export const iconClassMap = {
  color: {
    [IconColor.primary]: styles.iconIconPrimaryColor,
    [IconColor.light]: styles.iconIconLightColor,
    [IconColor.dark]: styles.iconIconDarkColor,
    [IconColor.gray]: styles.iconIconGrayColor,
    [IconColor.warning]: styles.iconIconWarningColor,
    [IconColor.success]: styles.iconIconSuccessColor,
    [IconColor.info]: styles.iconIconInfoColor,
    [IconColor.ternary]: styles.iconIconTernaryColor,
  },
  size: {
    [IconSize.small]: styles.iconSmallSize,
    [IconSize.medium]: styles.iconMediumSize,
    [IconSize.large]: styles.iconLargeSize,
    [IconSize.xlarge]: styles.iconXlargeSize,
    [IconSize.xxlarge]: styles.iconXxlargeSize,
    [IconSize.xxxlarge]: styles.iconXxxlargeSize,
  },
};
