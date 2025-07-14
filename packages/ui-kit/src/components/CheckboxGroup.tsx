import React from 'react';
import Checkbox from './Checkbox';
import styles from './checkbox-group.module.scss';

interface CheckboxGroupProps {
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  direction?: 'vertical' | 'horizontal';
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value,
  onChange,
  direction = 'vertical',
}) => {
  const handleChange = (checked: boolean, optionValue: string) => {
    const newValue = [...value];
    if (checked) {
      newValue.push(optionValue);
    } else {
      const index = newValue.indexOf(optionValue);
      if (index > -1) {
        newValue.splice(index, 1);
      }
    }
    onChange(newValue);
  };

  return (
    <div className={`${styles.checkboxGroup} ${styles[direction]}`}>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label}
          checked={value.includes(option.value)}
          onChange={(checked) => handleChange(checked, option.value)}
        />
      ))}
    </div>
  );
};

export default CheckboxGroup;
