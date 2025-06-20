import styles from './string-input.module.scss';

export const sizeClassMap: Record<string, string> = {
  small: styles.stringInputSmallSize,
  medium: styles.stringInputMediumSize,
};

export const inputSizeClassMap: Record<string, string> = {
  small: styles.inputSmallSize,
  medium: styles.inputMediumSize,
  large: styles.inputLargeSize,
};

export const iconPosClassMap: Record<string, string> = {
  right: styles.stringInputRightIcon,
};

export const inputClassMap: Record<string, string> = {
  smallleft: styles.smallSizeLeftIcon,
  smallrught: styles.smallSizeRightIcon,
  mediumleft: styles.mediumSizeLeftIcon,
  mediumright: styles.mediumSizeRightIcon,
};
