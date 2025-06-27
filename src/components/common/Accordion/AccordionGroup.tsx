import React, { type ReactElement, Children, cloneElement, useState } from 'react';
import styles from './accordion.module.scss';

interface AccordionProps {
  isOpen?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  defaultOpen?: boolean;
  header: React.ReactNode;
  children: React.ReactNode;
}

interface AccordionGroupProps {
  children: ReactElement<AccordionProps>[] | ReactElement<AccordionProps>;
  allowMultipleOpen?: boolean; // optional, default false
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({
  children,
  allowMultipleOpen = false,
}) => {
  // Initialize open state for all accordions; defaultOpen respected if provided
  const [openIndexes, setOpenIndexes] = useState<boolean[]>(
    () => Children.map(children, (child) => !!child.props.defaultOpen) || []
  );

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) => {
      if (allowMultipleOpen) {
        const newState = [...prev];
        newState[index] = !newState[index];
        return newState;
      } else {
        // Only one open at a time
        return prev.map((_, i) => (i === index ? !prev[i] : false));
      }
    });
  };

  return (
    <div className={styles.accordionGroup}>
      {Children.map(children, (child, index) => {
        if (!React.isValidElement<AccordionProps>(child)) return null;

        return cloneElement(child, {
          isOpen: openIndexes[index] || false,
          onToggle: () => toggleIndex(index),
        });
      })}
    </div>
  );
};
