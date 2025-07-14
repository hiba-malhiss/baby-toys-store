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
import Popover from '../Popover/Popover.tsx';
import clsx from 'clsx';
import { faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import Icon from '../Icon/Icon.tsx';
import Option from './Option.tsx';
import Checkbox from '../Checkbox';
import { Flex } from '../index';

interface SelectProps {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  children?: ReactNode;
  className?: string;
  isDisabled?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  hasError?: boolean;
  multiple?: boolean;
  clearable?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  children,
  className = '',
  isDisabled = false,
  placeholder = 'Select...',
  options,
  hasError,
  multiple = false,
  clearable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || (multiple ? [] : ''));
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValue = Array.isArray(internalValue) ? [...internalValue] : [];
      const index = newValue.indexOf(optionValue);
      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(optionValue);
      }
      setInternalValue(newValue);
      onChange?.(newValue);
    } else {
      setInternalValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const renderSelected = () => {
    if (multiple) {
      if (!Array.isArray(internalValue) || internalValue.length === 0) {
        return placeholder;
      }
      const selectedLabels = options
        ? internalValue.map((v) => options.find((o) => o.value === v)?.label)
        : Children.map(children, (child) => {
            if (isValidElement(child) && internalValue.includes(child.props.value)) {
              return child.props.children;
            }
            return null;
          });
      return selectedLabels.join(', ');
    }

    const selectedChild = Children.toArray(children).find(
      (child) => isValidElement(child) && child.props.value === internalValue
    ) as React.ReactElement;

    return options
      ? options.find((o) => o.value === internalValue)?.label || placeholder
      : selectedChild
        ? selectedChild.props.children
        : placeholder;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isDisabled) return;
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
      className={clsx(
        styles.select,
        className,
        isDisabled && styles.isDisabled,
        hasError && styles.selectHasError
      )}
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onClick={() => !isDisabled && setIsOpen((prev) => !prev)}
    >
      <div className={styles.selectLabel}>
        {renderSelected()}
        <Flex>
          {clearable &&
            (internalValue.length > 0 ||
              (Array.isArray(internalValue) && internalValue.length > 0)) && (
              <Icon
                icon={faTimes}
                onClick={(e) => {
                  e.stopPropagation();
                  if (multiple) {
                    setInternalValue([]);
                    onChange?.([]);
                  } else {
                    setInternalValue('');
                    onChange?.('');
                  }
                }}
              />
            )}
          <Icon icon={isOpen ? faChevronUp : faChevronDown} />
        </Flex>
      </div>
      <Popover
        open={isOpen}
        onClose={() => setIsOpen(false)}
        targetRef={selectRef}
        position="bottom"
        gap={8}
      >
        <div className={styles.selectOptions}>
          {options
            ? options.map((option) => (
                <Option
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  isSelected={
                    multiple
                      ? (internalValue as string[]).includes(option.value)
                      : option.value === internalValue
                  }
                >
                  <Flex align="center" spacing="m">
                    {multiple && <Checkbox checked={(internalValue as string[]).includes(option.value)} />}
                    <span>{option.label}</span>
                  </Flex>
                </Option>
              ))
            : Children.map(children, (child) => {
                if (!isValidElement(child)) return null;
                return cloneElement(child, {
                  isSelected: multiple
                    ? (internalValue as string[]).includes(child.props.value)
                    : child.props.value === internalValue,
                  onSelect: handleSelect,
                  children: (
                    <>
                      <Flex align="center" spacing="m">
                        {multiple && (
                          <Checkbox
                            checked={(internalValue as string[]).includes(child.props.value)}
                          />
                        )}
                        {child.props.children}
                      </Flex>
                    </>
                  ),
                });
              })}
        </div>
      </Popover>
    </div>
  );
};

export default Select;
