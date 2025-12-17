import React, { type ReactElement, Children, cloneElement, useState } from 'react';
import styles from './accordion.module.scss';
import clsx from 'clsx';

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
  fullWidth?: boolean;
  unstyled?: boolean;
  autoOverflow?: boolean;
  onChange?: (key: string) => void;
  activeKey?: string;
}

const AccordionGroup: React.FC<AccordionGroupProps> = ({
  children,
  allowMultipleOpen = false,
  fullWidth = false,
  onChange,
  unstyled,
  autoOverflow = false,
  activeKey,
}) => {
  // Initialize open state for all accordions; defaultOpen respected if provided
  const [openIndexes, setOpenIndexes] = useState<boolean[]>(
    () => Children.map(children, (child) => !!child.props.defaultOpen) || []
  );

  const toggleIndex = (index: number, key: string | number | null) => {
    // If controlled, just emit onChange and let parent update activeKey
    if (activeKey !== undefined) {
      if (onChange && key !== null) {
        const isCurrentlyOpen = String(key) === activeKey;
        onChange(isCurrentlyOpen ? '' : String(key));
      }
      return;
    }

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
    <div
      className={clsx(
        styles.accordionGroup,
        fullWidth && styles.fullWidth,
        unstyled && styles.unstyled,
        autoOverflow && styles.autoOverflow
      )}
    >
      {Children.map(children, (child, index) => {
        if (!React.isValidElement<AccordionProps>(child)) return null;
        const key = child.key ?? index;
        const isControlled = activeKey !== undefined && !allowMultipleOpen;
        const derivedIsOpen = isControlled
          ? String(key) === activeKey
          : openIndexes[index] || false;

        return cloneElement(child, {
          isOpen: derivedIsOpen,
          onToggle: () => toggleIndex(index, key),
        });
      })}
    </div>
  );
};

export default AccordionGroup;
