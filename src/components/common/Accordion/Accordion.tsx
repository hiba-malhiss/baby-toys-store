import React, { useState, type ReactNode, type KeyboardEvent } from 'react';
import styles from './accordion.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

interface AccordionProps {
  header: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  isOpen?: boolean;
  withoutPadding?: boolean;
  onToggle?: () => void;
  defaultOpen?: boolean;
  iconPosition?: 'left' | 'right';
}

export const Accordion: React.FC<AccordionProps> = ({
  header,
  disabled,
  children,
  isOpen: controlledIsOpen,
  onToggle,
  defaultOpen = false,
  withoutPadding = false,
  iconPosition = 'right',
}) => {
  // If controlled, use controlledIsOpen, else manage local open state
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const handleToggle = () => {
    if (disabled) return;
    if (isControlled) {
      onToggle && onToggle();
    } else {
      setUncontrolledIsOpen((open) => !open);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={clsx(
        styles.accordion,
        isOpen && styles.isActive,
        disabled && styles.isDisabled,
        isControlled && styles.isControlled,
        withoutPadding && styles.withoutPadding,
        styles[`accordion--${iconPosition}Icon`]
      )}
    >
      <div
        className={clsx(styles.accordionHeader)}
        onClick={handleToggle}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        onKeyDown={handleKeyDown}
      >
        {iconPosition === 'left' && (
          <FontAwesomeIcon
            icon={!isOpen ? faPlus : faMinus}
            className={clsx(styles.accordionHeaderIcon, styles.left)}
          />
        )}
        <div>{header}</div>
        {iconPosition === 'right' && (
          <FontAwesomeIcon
            icon={!isOpen ? faPlus : faMinus}
            className={clsx(styles.accordionHeaderIcon, styles.left)}
          />
        )}
      </div>
      {isOpen && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
};
