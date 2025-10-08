import React, { useEffect, useId, useMemo, useState, Children, isValidElement } from 'react';
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
  value?: string;
  onChange?: (val: string) => void;
  name?: string;
  children: React.ReactNode;
  size?: 'medium' | 'small';
  fullWidth?: boolean;
  responsive?: boolean;
};

const TabBar = ({
  direction = 'horizontal',
  tabs,
  defaultSelected,
  children,
  size = 'medium',
  responsive = true,
  fullWidth,
  value,
  onChange,
  name,
}: TabBarProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultSelected ?? tabs[0]?.value);
  const [isCompact, setIsCompact] = useState(false);
  const reactId = useId();
  const groupName = useMemo(() => name ?? `tab-bar-${reactId}`, [name, reactId]);

  useEffect(() => {
    if (!responsive) return;
    const mq = window.matchMedia?.('(max-width: 768px)');
    if (!mq) return;
    const apply = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = (e as MediaQueryList).matches ?? (e as MediaQueryListEvent).matches;
      setIsCompact(!!matches);
    };
    apply(mq);
    mq.addEventListener?.('change', apply as (e: MediaQueryListEvent) => void);
    // @ts-expect-error legacy API fallback
    mq.addListener && mq.addListener(apply);
    return () => {
      mq.removeEventListener?.('change', apply as (e: MediaQueryListEvent) => void);
      // @ts-expect-error legacy API fallback
      mq.removeListener && mq.removeListener(apply);
    };
  }, [responsive]);

  const effectiveSize: 'medium' | 'small' = responsive && isCompact ? 'small' : size;

  const tabChildren = Children.toArray(children).filter(isValidElement);

  const selectedValue = value ?? uncontrolled;
  const handleChange = (val: string) => {
    if (onChange) onChange(val);
    else setUncontrolled(val);
  };

  const activeContent = tabChildren.find((child: any) => child.props.value === selectedValue);

  return (
    <Flex
      direction="vertical"
      spacing={effectiveSize === 'small' ? 'l' : 'xxxxl'}
      fullWidth={fullWidth}
    >
      <RadioButtonGroup
        fullWidth
        spacing={effectiveSize === 'small' ? 'l' : 'xxxxl'}
        name={groupName}
        selectedValue={selectedValue}
        onChange={handleChange}
        direction={direction}
        align="center"
        justify="center"
        appearance="link-underline"
      >
        {tabs.map(({ header, value }) => (
          <RadioButton key={value} value={value}>
            <Heading level={effectiveSize === 'small' ? 'h5' : 'h3'}>{header}</Heading>
          </RadioButton>
        ))}
      </RadioButtonGroup>

      <>{activeContent}</>
    </Flex>
  );
};

export default TabBar;
