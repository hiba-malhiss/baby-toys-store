import { Icon } from '../Icon/Icon.tsx';
import Flex, { type Align } from '../Flex/Flex.tsx';
import { Button } from '../Button/Button.tsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styles from './empty-placeholder.module.scss';

type EmptyPlaceholderProps = {
  icon?: IconDefinition;
  message: string;
  buttonText?: string;
  iconSize?: string;
  align?: Align;
  onButtonClick?: () => void;
};

export const EmptyPlaceholder: React.FC<EmptyPlaceholderProps> = ({
  icon,
  message,
  buttonText,
  onButtonClick,
  iconSize = 'xxxlarge',
  align = 'center',
}) => {
  return (
    <Flex
      direction="vertical"
      spacing="xl"
      align={align}
      justify="center"
      fullWidth
      className={styles.emptyPlaceholder}
    >
      {icon && <Icon icon={icon} size={iconSize} color="gray" />}
      <p>{message}</p>
      {buttonText && onButtonClick && (
        <Button color="accent" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </Flex>
  );
};
