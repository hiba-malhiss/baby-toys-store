import Icon from './Icon/Icon.tsx';
import Flex, { type Align } from './Flex/Flex.tsx';
import Button from './Button/Button.tsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styles from './no-data-found.module.scss';
import { IconColor, IconSize } from './Icon/icon.constant.ts';
import clsx from 'clsx';

type NoDataFoundProps = {
  icon?: IconDefinition;
  message?: string;
  buttonText?: string;
  withoutPadding?: boolean;
  iconSize?: string;
  align?: Align;
  subtext?: string;
  onButtonClick?: () => void;
};

const NoDataFound: React.FC<NoDataFoundProps> = ({
  icon,
  message,
  buttonText,
  onButtonClick,
  iconSize = 'xxxlarge',
  align = 'center',
  subtext,
  withoutPadding,
}) => {
  return (
    <Flex
      direction="vertical"
      spacing="xl"
      align={align}
      justify="center"
      fullWidth
      className={clsx(styles.noDataFound, withoutPadding && styles.withoutPadding)}
    >
      {icon && (
        <Icon
          icon={icon}
          size={
            iconSize === 'xxxlarge'
              ? IconSize.xxxlarge
              : iconSize === 'xxlarge'
              ? IconSize.xxlarge
              : iconSize === 'xlarge'
              ? IconSize.xlarge
              : iconSize === 'large'
              ? IconSize.large
              : iconSize === 'small'
              ? IconSize.small
              : IconSize.medium
          }
          color={IconColor.gray}
          className={styles.noDataFoundIcon}
        />
      )}
      <p className={styles.noDataFoundText}>{message}</p>
      {subtext && <div className={styles.noDataFoundSubtext}>{subtext}</div>}
      {buttonText && onButtonClick && (
        <Button color="accent" onClick={onButtonClick} size="large">
          {buttonText}
        </Button>
      )}
    </Flex>
  );
};

export default NoDataFound;
