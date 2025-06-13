import React from 'react';
import Flex from '../../layout/Flex/Flex.tsx';
import RadioButton from './RadioButton';

type RadioOption = {
  label: string;
  value: string;
};

type RadioButtonGroupProps = {
  className?: string;
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  direction?: 'horizontal' | 'vertical';
};

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  name,
  options,
  selectedValue,
  className,
  onChange,
  direction = 'horizontal',
}) => {
  return (
    <Flex direction={direction} spacing="xl" className={className}>
      {options.map((option) => (
        <RadioButton
          key={option.value}
          name={name}
          label={option.label}
          value={option.value}
          isSelected={selectedValue === option.value}
          onChange={onChange}
        />
      ))}
    </Flex>
  );
};

export default RadioButtonGroup;
