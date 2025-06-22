import styles from './button.module.scss';

export const appearanceClassMap = {
  primary: styles.buttonPrimary,
  primary2: styles.buttonPrimary2,
  secondary: styles.buttonSecondary,
  link: styles.buttonLink,
  'light-link': styles.buttonLightLink,
  'primary-link': styles.buttonPrimaryLink,
  'primary2-link': styles.buttonPrimary2Link,
};

export const sizeClassMap = {
  small: styles.buttonSmallSize,
  medium: styles.buttonMediumSize,
  large: styles.buttonLargeSize,
  xlarge: styles.buttonXlargeSize,
  xxlarge: styles.buttonXxlargeSize,
};
