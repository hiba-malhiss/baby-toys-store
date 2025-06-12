import React from 'react';
import styles from './radio-button.module.scss';
import clsx from 'clsx';

type RadioButtonProps = {
  name: string;
  label: string;
  value: string;
  isSelected: boolean;
  onChange: (value: string) => void;
};

const RadioButton: React.FC<RadioButtonProps> = ({ name, label, value, isSelected, onChange }) => {
  return (
    <label
      htmlFor={`${name}-${value}`}
      className={clsx(styles.radioButton, { [styles.radioButtonSelected]: isSelected })}
      onClick={() => onChange(value)}
    >
      <input
        type="radio"
        id={`${name}-${value}`}
        name={name}
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
      />
      {label}
    </label>
  );
};

export default RadioButton;
