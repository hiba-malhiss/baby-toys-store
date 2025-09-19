import React, { useState } from 'react';
import StringInput, { type StringInputProps } from '../StringInput/StringInput';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styles from './string-input-with-button.module.scss';
import Button from '../Button/Button.tsx';
import clsx from 'clsx';
import { fa0 } from '@fortawesome/free-solid-svg-icons';

interface StringInputWithButtonProps extends Omit<StringInputProps, 'onChange' | 'value'> {
  buttonIcon: IconDefinition;
  onClick: (value: string) => void;
  onClear?: () => void;
  value?: string;
}

const StringInputWithButton: React.FC<StringInputWithButtonProps> = ({
  buttonIcon,
  onClick,
  className,
  value: externalValue,
  onClear,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState(externalValue || '');

  const handleButtonClick = () => {
    onClick(inputValue);
  };

  return (
    <div className={clsx(className, styles.stringInputWithButton)}>
      <StringInput
        {...rest}
        value={inputValue}
        onChange={(value) => {
          setInputValue(value);
          if (!value?.length) {
            onClear?.();
          }
        }}
        fullWidth
        icon={fa0}
        iconPosition="right"
      />
      <Button
        rightIcon={buttonIcon}
        onClick={handleButtonClick}
        isDisabled={rest.isDisabled}
        className={styles.stringInputWithButtonButton}
      />
    </div>
  );
};

export default StringInputWithButton;
