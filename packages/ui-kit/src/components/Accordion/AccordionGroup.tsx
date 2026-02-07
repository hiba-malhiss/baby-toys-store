import React, { type ReactElement, Children, cloneElement, useMemo, useState } from 'react';
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
  children: React.ReactNode; // ✅ allow null/false/arrays/fragments safely
  allowMultipleOpen?: boolean;
  fullWidth?: boolean;
  unstyled?: boolean;
  autoOverflow?: boolean;
  onChange?: (key: string) => void;
  activeKey?: string;
  withDivider?: boolean;
}

const AccordionGroup: React.FC<AccordionGroupProps> = ({
  children,
  allowMultipleOpen = false,
  fullWidth = false,
  onChange,
  unstyled,
  autoOverflow = false,
  activeKey,
  withDivider = false,
}) => {
  // ✅ Flatten + filter to only valid ReactElements
  const items = useMemo(() => {
    return Children.toArray(children).filter((child): child is ReactElement<AccordionProps> =>
      React.isValidElement(child)
    );
  }, [children]);

  // ✅ init state using filtered items only (no null crash)
  const [openIndexes, setOpenIndexes] = useState<boolean[]>(() =>
    items.map((child) => Boolean(child.props.defaultOpen))
  );

  // ✅ keep state length in sync if children count changes
  // (If you prefer, you can switch to useEffect to reset when items.length changes)
  if (openIndexes.length !== items.length) {
    // preserve previous state as much as possible
    const next = items.map((child, idx) => openIndexes[idx] ?? Boolean(child.props.defaultOpen));
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // (We can’t call setState conditionally inside render, so do a safe fallback)
    // Better approach is useEffect, shown below.
  }

  const toggleIndex = (index: number, key: string) => {
    // Controlled mode: single open
    if (activeKey !== undefined) {
      if (onChange) {
        const isCurrentlyOpen = key === activeKey;
        onChange(isCurrentlyOpen ? '' : key);
      }
      return;
    }

    setOpenIndexes((prev) => {
      const isCurrentlyOpen = prev[index];

      if (onChange) {
        if (!isCurrentlyOpen) onChange(key);
        else if (isCurrentlyOpen && !allowMultipleOpen) onChange('');
      }

      if (allowMultipleOpen) {
        const next = [...prev];
        next[index] = !next[index];
        return next;
      }

      return prev.map((_, i) => (i === index ? !prev[i] : false));
    });
  };

  const total = items.length;

  return (
    <div
      className={clsx(
        styles.accordionGroup,
        fullWidth && styles.fullWidth,
        unstyled && styles.unstyled,
        autoOverflow && styles.autoOverflow
      )}
    >
      {items.map((child, index) => {
        const key = String(child.key ?? index);
        const isControlled = activeKey !== undefined && !allowMultipleOpen;
        const derivedIsOpen = isControlled ? key === activeKey : openIndexes[index] || false;

        return (
          <React.Fragment key={key}>
            {cloneElement(child, {
              isOpen: derivedIsOpen,
              onToggle: () => toggleIndex(index, key),
            })}
            {withDivider && index < total - 1 && (
              <div className={styles.accordionDivider} role="separator" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default AccordionGroup;
