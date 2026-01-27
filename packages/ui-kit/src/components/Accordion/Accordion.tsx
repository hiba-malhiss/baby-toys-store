import React, { useState, type ReactNode } from 'react';
import styles from './accordion.module.scss';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Button, { type ButtonAppearance, type ButtonColor } from '../Button/Button.tsx';
import { Heading } from '../index.ts';

interface AccordionProps {
  header: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  isOpen?: boolean;
  withoutPadding?: boolean;
  withoutHeaderPadding?: boolean;
  hasError?: boolean;
  onToggle?: () => void;
  defaultOpen?: boolean;
  isOpenByDefault?: boolean;
  iconPosition?: 'left' | 'right';
  buttonAppearance?: ButtonAppearance;
  buttonColor?: ButtonColor;
  unstyled?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  header,
  disabled,
  children,
  isOpen: controlledIsOpen,
  onToggle,
  defaultOpen = false,
  withoutPadding = false,
  isOpenByDefault = false,
  withoutHeaderPadding = false,
  iconPosition = 'right',
  buttonAppearance = 'link',
  buttonColor = 'primary',
  unstyled,
}) => {
  // If controlled, use controlledIsOpen, else manage local open state
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen || isOpenByDefault);
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

  return (
    <div
      className={clsx(
        styles.accordion,
        isOpen && styles.isActive,
        disabled && styles.isDisabled,
        isControlled && styles.isControlled,
        withoutPadding && styles.withoutPadding,
        unstyled && styles.unstyled,
        styles[`accordion--${iconPosition}Icon`]
      )}
    >
      <Button
        onClick={handleToggle}
        leftIcon={iconPosition === 'left' && (!isOpen ? faPlus : faMinus)}
        rightIcon={iconPosition === 'right' && (!isOpen ? faPlus : faMinus)}
        fullWidth
        iconColor={buttonColor === 'error' ? 'error' : ''}
        align={iconPosition === 'left' ? 'start' : 'between'}
        appearance={buttonAppearance}
        color={buttonColor}
        withoutPadding={withoutHeaderPadding}
      >
        {unstyled ? <span>{header}</span> : <Heading level="h5">{header}</Heading>}
      </Button>
      {isOpen && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
};

export default Accordion;
