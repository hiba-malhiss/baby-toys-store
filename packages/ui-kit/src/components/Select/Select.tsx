// Select.tsx
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
  type KeyboardEvent,
  Children,
  cloneElement,
  isValidElement,
} from 'react';
import styles from './select.module.scss';
import Popover from '../Popover/Popover.tsx';
import clsx from 'clsx';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import Icon from '../Icon/Icon.tsx';
import Option from './Option.tsx';
import Checkbox from '../Checkbox';
import { Flex, StringInput } from '../index';

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

  /** When true, renders a StringInput inside the dropdown and filters options/children */
  isSearchableInternally?: boolean;
  searchPlaceholder?: string;
}

const normalize = (s: string) => s.toLowerCase().trim();

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
  isSearchableInternally = false,
  searchPlaceholder = 'Search...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | string[]>(
    value ?? (multiple ? [] : '')
  );
  const [search, setSearch] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  // Sync controlled value -> internal state
  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) setSearch('');
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const current = Array.isArray(internalValue) ? [...internalValue] : [];
      const index = current.indexOf(optionValue);
      if (index > -1) current.splice(index, 1);
      else current.push(optionValue);

      setInternalValue(current);
      onChange?.(current);
    } else {
      setInternalValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
      setSearch('');
    }
  };

  const clearSelection = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (multiple) {
      setInternalValue([]);
      onChange?.([]);
    } else {
      setInternalValue('');
      onChange?.('');
    }
    setSearch('');
  };

  const renderSelected = () => {
    if (multiple) {
      if (!Array.isArray(internalValue) || internalValue.length === 0) return placeholder;

      const selectedLabels = options
        ? (internalValue as string[]).map((v) => options.find((o) => o.value === v)?.label || '')
        : Children.map(children, (child) => {
            if (isValidElement(child) && (internalValue as string[]).includes(child.props.value)) {
              return child.props.children as string;
            }
            return null;
          }) || [];

      return (selectedLabels as (string | null)[]).filter(Boolean).join(', ');
    }

    const selectedChild = Children.toArray(children).find(
      (child) => isValidElement(child) && child.props.value === internalValue
    ) as React.ReactElement | undefined;

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
      setSearch('');
    }
  };

  const filteredOptions = useMemo(() => {
    if (!options) return null;
    if (!isSearchableInternally || !search) return options;
    const q = normalize(search);
    return options.filter((o) => normalize(o.label).includes(q));
  }, [options, isSearchableInternally, search]);

  const filteredChildren = useMemo(() => {
    if (options) return null;
    const arr = Children.toArray(children).filter(isValidElement) as React.ReactElement[];
    if (!isSearchableInternally || !search) return arr;
    const q = normalize(search);
    return arr.filter((child) => normalize(String(child.props.children ?? '')).includes(q));
  }, [children, options, isSearchableInternally, search]);

  const hasSelection =
    (Array.isArray(internalValue) && internalValue.length > 0) ||
    (!Array.isArray(internalValue) && !!internalValue);

  const showNoResults =
    isSearchableInternally &&
    ((options && (filteredOptions?.length ?? 0) === 0) ||
      (!options && (filteredChildren?.length ?? 0) === 0));

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
          {clearable && hasSelection && (
            <span
              onClick={clearSelection}
              role="button"
              aria-label="clear selection"
              className={styles.clearIcon}
            >
              <Icon icon={X} />
            </span>
          )}
          <Icon icon={isOpen ? ChevronUp : ChevronDown} />
        </Flex>
      </div>

      <Popover
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSearch('');
        }}
        targetRef={selectRef}
        position="bottom"
        gap={8}
        withArrow={false}
        size="medium"
      >
        <div className={styles.selectPopover} onClick={(e) => e.stopPropagation()}>
          {isSearchableInternally && (
            <div className={styles.selectSearch}>
              <StringInput
                fullWidth
                value={search}
                onChange={(value) => setSearch(value)}
                placeholder={searchPlaceholder}
                autoFocus
              />
            </div>
          )}

          <div className={styles.selectOptions}>
            {showNoResults ? (
              <div className={styles.noResults}>No results</div>
            ) : options ? (
              (filteredOptions ?? []).map((option) => (
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
                    {multiple && (
                      <Checkbox checked={(internalValue as string[]).includes(option.value)} />
                    )}
                    <span>{option.label}</span>
                  </Flex>
                </Option>
              ))
            ) : (
              (filteredChildren ?? []).map((child) =>
                cloneElement(child, {
                  isSelected: multiple
                    ? (internalValue as string[]).includes(child.props.value)
                    : child.props.value === internalValue,
                  onSelect: handleSelect,
                  children: (
                    <Flex align="center" spacing="m">
                      {multiple && (
                        <Checkbox
                          checked={(internalValue as string[]).includes(child.props.value)}
                        />
                      )}
                      {child.props.children}
                    </Flex>
                  ),
                })
              )
            )}
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default Select;
