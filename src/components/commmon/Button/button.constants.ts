import styles from './button.module.scss';

export const appearanceClassMap = {
  primary: styles.buttonPrimary,
  secondary: styles.buttonSecondary,
  link: styles.buttonLink,
  'light-link': styles.buttonLightLink,
  'primary-link': styles.buttonPrimaryLink,
};

export const sizeClassMap = {
  small: styles.buttonSmall,
  medium: styles.buttonMedium,
  large: styles.buttonLarge,
};
