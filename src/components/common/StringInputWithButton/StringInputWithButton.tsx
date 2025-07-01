import React from 'react';
import { StringInput, type StringInputProps } from '../StringInput/StringInput';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styles from './string-input-with-button.module.scss';
import { Button } from '../Button/Button.tsx';
import clsx from 'clsx';
import { fa0 } from '@fortawesome/free-solid-svg-icons';

interface StringInputWithButtonProps extends StringInputProps {
  buttonIcon: IconDefinition;
  onClick: (value: string) => void;
}

export const StringInputWithButton: React.FC<StringInputWithButtonProps> = ({
  buttonIcon,
  onClick,
  className,
  ...rest
}) => {
  return (
    <div className={clsx(className, styles.stringInputWithButton)}>
      <StringInput {...rest} fullWidth icon={fa0} iconPosition="right" />
      <Button
        rightIcon={buttonIcon}
        onClick={onClick}
        isDisabled={rest.isDisabled}
        className={styles.stringInputWithButtonButton}
      ></Button>
    </div>
  );
};
