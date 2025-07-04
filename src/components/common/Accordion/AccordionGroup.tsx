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
  onChange?: (key: string) => void;
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({
  children,
  allowMultipleOpen = false,
  onChange,
}) => {
  // Initialize open state for all accordions; defaultOpen respected if provided
  const [openIndexes, setOpenIndexes] = useState<boolean[]>(
    () => Children.map(children, (child) => !!child.props.defaultOpen) || []
  );

  const toggleIndex = (index: number, key: string | number | null) => {
    setOpenIndexes((prev) => {
      const isCurrentlyOpen = prev[index];
      if (!isCurrentlyOpen && onChange && key !== null) {
        onChange(String(key));
      } else if (isCurrentlyOpen && onChange && key !== null && !allowMultipleOpen) {
        onChange(''); // nothing open anymore
      }

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
        const key = child.key ?? index; // fallback if no key is provided
        return cloneElement(child, {
          isOpen: openIndexes[index] || false,
          onToggle: () => toggleIndex(index, key),
        });
      })}
    </div>
  );
};
