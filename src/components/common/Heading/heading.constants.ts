import styles from './heading.module.scss';

export const alignClassMap = {
  left: styles.headingLeftAlign,
  center: styles.headingCenterAlign,
  right: styles.headingRightAlign,
};

export const appearanceClassMap = {
  dark: styles.headingDarkAppearance,
  light: styles.headingLightAppearance,
  white: styles.headingWhiteAppearance,
};

export const levelClassMap = {
  h0: styles.headingH0Level,
  h1: styles.headingH1Level,
  h2: styles.headingH2Level,
  h3: styles.headingH3Level,
  h4: styles.headingH4Level,
  h5: styles.headingH5Level,
  h6: styles.headingH6Level,
};
