import React, { useState, Children, isValidElement } from 'react';
import RadioButtonGroup from '../RadioButtonGroup/RadioButtonGroup';
import RadioButton from '../RadioButtonGroup/RadioButton.tsx';
import Flex from '../Flex/Flex.tsx';
import Heading from '../Heading/Heading.tsx';

export type Tab = {
  header: React.ReactNode;
  value: string;
};

type TabBarProps = {
  direction?: 'vertical' | 'horizontal';
  tabs: Tab[];
  defaultSelected?: string;
  children: React.ReactNode;
};

export const TabBar = ({
  direction = 'horizontal',
  tabs,
  defaultSelected,
  children,
}: TabBarProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultSelected ?? tabs[0]?.value);

  const tabChildren = Children.toArray(children).filter(isValidElement);

  const activeContent = tabChildren.find((child: any) => {
    return child.props.value === selectedValue;
  });

  return (
    <Flex direction="vertical" spacing="xxxxl">
      <RadioButtonGroup
        fullWidth
        spacing="xxxxl"
        name="tab-bar"
        selectedValue={selectedValue}
        onChange={(val) => setSelectedValue(val)}
        direction={direction}
        align="center"
        justify="center"
        appearance="link2"
      >
        {tabs.map(({ header, value }) => (
          <RadioButton key={value} value={value}>
            <Heading level="h3">{header}</Heading>
          </RadioButton>
        ))}
      </RadioButtonGroup>

      <>{activeContent}</>
    </Flex>
  );
};
