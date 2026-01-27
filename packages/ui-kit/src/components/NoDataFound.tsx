import Icon from './Icon/Icon.tsx';
import Flex, { type Align } from './Flex/Flex.tsx';
import Button from './Button/Button.tsx';
import styles from './no-data-found.module.scss';
import { IconColor, IconSize } from './Icon/icon.constant.ts';
import clsx from 'clsx';
import type { ComponentType } from 'react';

type NoDataFoundProps = {
  iconComp?: ComponentType<any> | null;
  message?: string;
  buttonText?: string;
  withoutPadding?: boolean;
  iconSize?: string;
  align?: Align;
  subtext?: string;
  onButtonClick?: () => void;
};

const NoDataFound: React.FC<NoDataFoundProps> = ({
  iconComp,
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
      {iconComp && (
        <Icon
          icon={iconComp}
          size={iconSize}
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
