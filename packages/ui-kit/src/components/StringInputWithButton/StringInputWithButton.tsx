import React, { useState } from 'react';
import StringInput, { type StringInputProps } from '../StringInput/StringInput';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styles from './string-input-with-button.module.scss';
import clsx from 'clsx';

interface StringInputWithButtonProps extends Omit<StringInputProps, never> {
  buttonIcon: IconDefinition;
  onClick: (value: string) => void;
  onClear?: () => void;
  value?: string;
  onChange?: (value: string) => void;
}

const StringInputWithButton: React.FC<StringInputWithButtonProps> = ({
  buttonIcon,
  onClick,
  className,
  value: externalValue,
  onClear,
  onChange,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState(externalValue || '');

  const handleButtonClick = () => {
    onClick((externalValue ?? inputValue) || '');
  };

  return (
    <div className={clsx(className, styles.stringInputWithButton)}>
      <StringInput
        {...rest}
        value={externalValue ?? inputValue}
        onChange={(value) => {
          const strVal = String(value ?? '');
          setInputValue(strVal);
          onChange?.(strVal);
          if (!strVal.length) {
            onClear?.();
          }
        }}
        fullWidth
        // New approach: render action as right icon with background and click handler
        iconRight={buttonIcon}
        withIconBackground
        onIconClick={handleButtonClick}
        iconPosition="right"
      />
    </div>
  );
};

export default StringInputWithButton;
