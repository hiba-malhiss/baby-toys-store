import React, { Children, isValidElement, cloneElement } from 'react';
import Flex, {
  type Align,
  type Direction,
  type Justify,
  type Spacing,
} from '../../common/Flex/Flex.tsx';
import RadioButton from './RadioButton';

type RadioOption = {
  label: React.ReactNode;
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
  justify?: Justify;
  spacing?: Spacing;
  appearance?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  className,
  name,
  options,
  selectedValue,
  onChange,
  direction = 'horizontal',
  spacing = 'xl',
  align = 'stretch',
  justify = 'stretch',
  appearance,
  children,
  fullWidth,
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
      if (isValidElement(child)) {
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
    <Flex
      direction={direction}
      className={className}
      align={align}
      justify={justify}
      spacing={spacing}
      fullWidth={fullWidth}
    >
      {renderButtons()}
    </Flex>
  );
};

export default RadioButtonGroup;
