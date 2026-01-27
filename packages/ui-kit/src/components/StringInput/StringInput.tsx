import React, { useEffect, useState, useRef, useCallback } from 'react';
import clsx from 'clsx';
import styles from './string-input.module.scss';
import Icon from '../Icon/Icon.tsx';
import Button from '../Button/Button.tsx';
import Tooltip from '../Tooltip/Tooltip.tsx';
import Popover from '../Popover/Popover.tsx';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import type { IconColor } from '../Icon/icon.constant.ts';
import { IconSize } from '../Icon/icon.constant.ts';

export type IconPosition = 'left' | 'right';
export type StringInputSize = 'small' | 'medium' | 'large';

export interface Suggestion {
  id: string | number;
  label: string;
  data?: any;
}

export interface StringInputProps {
  type?: string;
  min?: string | number;
  max?: string | number;
  value?: string | number;
  onChange?: (val: string | number, byControls: boolean) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: any;
  iconRight?: any;
  onIconClick?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  iconColor?: IconColor;
  className?: string;
  iconPosition?: IconPosition;
  withIconBackground?: boolean;
  maxTooltip?: React.ReactNode;
  isDisabled?: boolean;
  isRounded?: boolean;
  size?: StringInputSize;
  fullWidth?: boolean;
  hasError?: boolean;
  withControls?: boolean;
  readOnly?: boolean;
  showCounter?: boolean;
  maxLength?: number;
  truncateOverflow?: boolean;
  autoComplete?: string;

  // Autocomplete props
  autoCompleteEnabled?: boolean;
  getSuggestions?: (q: string) => Promise<Suggestion[]>;
  onSuggestionSelected?: (item: Suggestion) => void;
  suggestionsDebounceMs?: number;
}

const StringInput: React.FC<StringInputProps> = ({
  className,
  type = 'text',
  min,
  max,
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder = '',
  icon,
  iconRight,
  onIconClick,
  withIconBackground = false,
  iconColor,
  iconPosition = 'left',
  isDisabled = false,
  size = 'medium',
  fullWidth = false,
  isRounded = false,
  withControls = false,
  hasError,
  maxTooltip,
  readOnly = false,
  showCounter = false,
  maxLength,
  truncateOverflow = false,
  onClick,
  autoComplete,
  autoCompleteEnabled = false,
  getSuggestions,
  onSuggestionSelected,
  suggestionsDebounceMs = 250,
}) => {
  const isControlled = value !== undefined && onChange !== undefined;
  const [internalValue, setInternalValue] = useState<string>(() => {
    if (!isControlled) return value !== undefined && value !== null ? String(value) : '';
    return '';
  });

  useEffect(() => {
    if (!isControlled) {
      const valStr = value !== undefined && value !== null ? String(value) : '';
      if (valStr !== internalValue) setInternalValue(valStr);
    }
  }, [value, isControlled]);

  const [showMaxTooltip, setShowMaxTooltip] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const anchorRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | undefined>(undefined);

  const resolvedIcon = iconRight ?? icon;
  const resolvedIconPosition: IconPosition = iconRight ? 'right' : iconPosition;

  const handleChange = (newVal: string, byControls = false) => {
    if (!isControlled) setInternalValue(newVal);

    if (type === 'number') {
      const trimmed = newVal.trim();
      if (!trimmed) {
        onChange?.(null as any, byControls);
        return;
      }
      const parsed = parseFloat(trimmed);
      if (!isNaN(parsed)) {
        onChange?.(parsed as any, byControls);
        const maxVal = max !== undefined ? parseFloat(String(max)) : undefined;
        if (parsed && maxVal !== undefined && parsed >= maxVal && maxTooltip) {
          setShowMaxTooltip(true);
          setTimeout(() => setShowMaxTooltip(false), 1500);
        }
      } else {
        onChange?.(NaN as any, byControls);
      }
    } else {
      onChange?.(newVal as any, byControls);
    }

    if (autoCompleteEnabled && type !== 'number') {
      const trimmed = newVal.trim();
      if (!trimmed) {
        setSuggestions([]);
        setActiveIndex(-1);
        setOpen(false);
        return;
      }
      if (getSuggestions) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(async () => {
          try {
            setLoading(true);
            const items = await getSuggestions(trimmed);
            setSuggestions(items);
            setActiveIndex(items.length > 0 ? 0 : -1);
            setOpen(true);
          } catch {
            setSuggestions([]);
            setActiveIndex(-1);
          } finally {
            setLoading(false);
          }
        }, suggestionsDebounceMs);
      }
    }
  };

  const handleStep = (step: number) => {
    if (isDisabled) return;
    const currentValue = isControlled ? String(value ?? '') : internalValue;
    const current = parseFloat(currentValue || String(min ?? '0'));
    const next = current + step;
    const minVal = min !== undefined ? parseFloat(String(min)) : undefined;
    const maxVal = max !== undefined ? parseFloat(String(max)) : undefined;
    if (minVal !== undefined && next < minVal) return;
    if (maxVal !== undefined && next > maxVal) return;
    handleChange(next.toString(), true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (!autoCompleteEnabled || !open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (suggestions.length === 0 ? -1 : (prev + 1) % suggestions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        suggestions.length === 0 ? -1 : (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        const item = suggestions[activeIndex];
        onSuggestionSelected?.(item);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const containerClass = clsx(
    styles.stringInput,
    styles[`stringInput--${size}Size`],
    styles[`stringInput--${resolvedIconPosition}Icon`],
    isRounded && styles.isRounded,
    {
      [styles.stringWithControls]: withControls,
      [styles.stringInputFullWidth]: fullWidth,
      [styles.stringInputWithControls]: type === 'number' && withControls,
    }
  );
  const resolvedDisabled = !!isDisabled;
  const inputClass = clsx(
    styles.input,
    styles[`input--${size}Size`],
    styles[`${size}Size-${resolvedIconPosition}Icon`],
    {
      [styles.isDisabled]: resolvedDisabled,
      [styles.hasIcon]: resolvedIcon,
      [styles.hasError]: !!hasError,
    }
  );
  const currentStr = isControlled ? String(value ?? '') : internalValue;
  const currentLen = currentStr?.length ?? 0;

  const highlightMatch = useCallback((label: string, query: string) => {
    const regex = new RegExp(`(${query})`, 'gi');
    return label
      .split(regex)
      .map((part, i) => (regex.test(part) ? <strong key={i}>{part}</strong> : part));
  }, []);

  return (
    <div
      ref={anchorRef}
      className={clsx(className, fullWidth && styles.fullWidth)}
      onClick={onClick}
    >
      <div className={containerClass}>
        {type === 'number' && withControls && (
          <Button
            appearance="link"
            color="primary"
            size={size}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleStep(-1);
            }}
            leftIcon={faMinus}
            isDisabled={resolvedDisabled}
            className={styles.stringInputDecreaseControl}
          />
        )}

        <input
          type={type}
          min={min}
          max={max}
          maxLength={typeof maxLength === 'number' ? maxLength : undefined}
          step="any"
          disabled={resolvedDisabled}
          readOnly={readOnly}
          placeholder={placeholder}
          value={currentStr}
          onFocus={() => onFocus?.()}
          onBlur={() => onBlur?.()}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={clsx(inputClass, truncateOverflow && styles.inputTruncate)}
          title={typeof currentStr === 'string' ? currentStr : undefined}
          autoComplete={autoComplete}
        />

        {type === 'number' && withControls && (
          <Tooltip content={maxTooltip} position="top" mode="manual" open={showMaxTooltip}>
            <Button
              appearance="link"
              color="primary"
              size={size}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleStep(1);
              }}
              leftIcon={faPlus}
              isDisabled={resolvedDisabled}
              className={styles.stringInputIncreaseControl}
            />
          </Tooltip>
        )}

        {resolvedIcon && (
          <div
            className={clsx(
              styles.icon,
              withIconBackground && styles.iconButton,
              withIconBackground && styles[`iconButton--${size}Size`]
            )}
            onClick={(e) => {
              if (isDisabled) return;
              onIconClick?.(e);
            }}
            role={onIconClick ? 'button' : undefined}
            aria-disabled={isDisabled}
          >
            <Icon
              icon={resolvedIcon}
              className={clsx(styles.icon)}
              color={iconColor}
              size={
                size === 'small'
                  ? IconSize.small
                  : size === 'large'
                    ? IconSize.large
                    : IconSize.medium
              }
            />
          </div>
        )}
      </div>

      {showCounter && (
        <div className={styles.stringInputCounter}>
          {currentLen}
          {typeof maxLength === 'number' ? ` / ${maxLength}` : ''}
        </div>
      )}

      {autoCompleteEnabled && (
        <Popover
          targetRef={anchorRef as any}
          open={open}
          onClose={() => setOpen(false)}
          position="bottom"
          dismissible
          size="small"
        >
          <div className={styles.suggestions} role="listbox" aria-label="Suggestions">
            {loading && <div className={styles.suggestionItem}>Loading...</div>}
            {!loading && suggestions.length === 0 && (
              <div className={styles.suggestionItem}>No results</div>
            )}
            {!loading &&
              suggestions.map((item, idx) => (
                <button
                  type="button"
                  key={`${item.id}-${item.label}`}
                  className={clsx(
                    styles.suggestionItem,
                    idx === activeIndex && styles.suggestionItemActive
                  )}
                  onClick={() => {
                    onSuggestionSelected?.(item);
                    setOpen(false);
                  }}
                >
                  {highlightMatch(item.label, currentStr)}
                </button>
              ))}
          </div>
        </Popover>
      )}
    </div>
  );
};

export default StringInput;
