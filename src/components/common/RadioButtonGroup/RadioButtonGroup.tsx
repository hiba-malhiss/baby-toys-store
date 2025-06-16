import React, { Children, isValidElement, cloneElement, type ReactElement } from 'react';
import Flex, { type Align, type Direction, type Spacing } from '../../common/Flex/Flex.tsx';
import RadioButton from './RadioButton';

type RadioOption = {
  label: React.ReactNode;
  value: string;
  appearance?: string;
};

type RadioButtonProps = {
  value: string;
  appearance?: string;
};

interface RadioButtonGroupProps {
  className?: string;
  name: string;
  options?: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  direction?: Direction;
  align?: Align;
  spacing?: Spacing;
  appearance?: string;
  children?: React.ReactNode;
}

const isRadioButtonElement = (child: React.ReactNode): child is ReactElement<RadioButtonProps> => {
  return isValidElement(child) && typeof child.props.value === 'string';
};

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  className,
  name,
  options,
  selectedValue,
  onChange,
  direction = 'horizontal',
  spacing = 'xl',
  align = 'stretch',
  appearance,
  children,
}) => {
  const renderButtons = () => {
    if (options && options.length > 0) {
      return options.map((option) => (
        <RadioButton
          key={option.value}
          name={name}
          value={option.value}
          isSelected={selectedValue === option.value}
          onChange={onChange}
          appearance={appearance}
        >
          {option.label}
        </RadioButton>
      ));
    }

    return Children.map(children, (child) => {
      if (isRadioButtonElement(child)) {
        return cloneElement(child, {
          name,
          isSelected: selectedValue === child.props.value,
          onChange,
          appearance: appearance,
        });
      }
      return child;
    });
  };

  return (
    <Flex direction={direction} className={className} align={align} spacing={spacing}>
      {renderButtons()}
    </Flex>
  );
};

export default RadioButtonGroup;
