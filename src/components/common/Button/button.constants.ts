import styles from './button.module.scss';

export const appearanceClassMap = {
  primary: styles.buttonPrimary,
  secondary: styles.buttonSecondary,
  link: styles.buttonLink,
  'light-link': styles.buttonLightLink,
  'primary-link': styles.buttonPrimaryLink,
  'secondary-link': styles.buttonSecondaryLink,
};

export const sizeClassMap = {
  small: styles.buttonSmallSize,
  medium: styles.buttonMediumSize,
  large: styles.buttonLargeSize,
  xlarge: styles.buttonXlargeSize,
  xxlarge: styles.buttonXxlargeSize,
};
