import { Icon } from '../Icon/Icon.tsx';
import Flex from '../Flex/Flex.tsx';
import { Button } from '../Button/Button.tsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styles from './empty-placeholder.module.scss';

type EmptyPlaceholderProps = {
  icon: IconDefinition;
  message: string;
  buttonText?: string;
  iconSize?: string;
  onButtonClick?: () => void;
};

export const EmptyPlaceholder: React.FC<EmptyPlaceholderProps> = ({
  icon,
  message,
  buttonText,
  onButtonClick,
  iconSize = 'xxxlarge',
}) => {
  return (
    <Flex
      direction="vertical"
      spacing="xl"
      align="center"
      justify="center"
      fullWidth
      className={styles.emptyPlaceholder}
    >
      <Icon icon={icon} size={iconSize} color="gray" />
      <p>{message}</p>
      {buttonText && onButtonClick && (
        <Button color="accent" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </Flex>
  );
};
