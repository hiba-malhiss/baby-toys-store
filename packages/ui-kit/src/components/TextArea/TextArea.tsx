import React from 'react';
import clsx from 'clsx';
import styles from './textarea.module.scss';

export type TextAreaSize = 'small' | 'medium' | 'large';

export interface TextAreaProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
  size?: TextAreaSize;
  fullWidth?: boolean;
  hasError?: boolean;
  rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  className,
  value,
  onChange,
  placeholder = '',
  isDisabled = false,
  size = 'medium',
  fullWidth = false,
  hasError,
  rows = 4,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  const textAreaClass = clsx(
    styles.textarea,
    styles[`textarea--${size}Size`],
    {
      [styles.isDisabled]: isDisabled,
      [styles.hasError]: !!hasError,
      [styles.fullWidth]: fullWidth,
    },
    className
  );

  return (
    <textarea
      disabled={isDisabled}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className={textAreaClass}
      rows={rows}
    />
  );
};

export default TextArea;
