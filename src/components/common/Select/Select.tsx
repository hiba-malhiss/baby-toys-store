import React, {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
  Children,
  cloneElement,
  isValidElement,
} from 'react';
import styles from './Select.module.scss';
import { Popover } from '../Popover/Popover.tsx';
import clsx from 'clsx';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '../Icon/Icon.tsx';

interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  children,
  className = '',
  disabled = false,
  placeholder = 'Select...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const selectedChild = Children.toArray(children).find(
    (child) => isValidElement(child) && child.props.value === internalValue
  ) as React.ReactElement;

  const handleSelect = (optionValue: string) => {
    setInternalValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={selectRef}
      className={clsx(styles.select, className, disabled && styles.isDisabled)}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onClick={() => !disabled && setIsOpen((prev) => !prev)}
    >
      <div className={styles.selectLabel}>
        {selectedChild ? selectedChild.props.children : placeholder}
        <Icon icon={isOpen ? faChevronUp : faChevronDown} />
      </div>
      <Popover
        open={isOpen}
        onClose={() => setIsOpen(false)}
        targetRef={selectRef}
        position="bottom"
        gap={8}
      >
        <div className={styles.selectOptions}>
          {Children.map(children, (child) => {
            if (!isValidElement(child)) return null;

            return cloneElement(child, {
              isSelected: child.props.value === internalValue,
              onSelect: handleSelect,
            });
          })}
        </div>
      </Popover>
    </div>
  );
};
