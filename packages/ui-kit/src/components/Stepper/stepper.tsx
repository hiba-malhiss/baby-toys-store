import React, { useCallback, useMemo, useState } from 'react';
import { StepperContext, useStepperContext } from './stepper.context';
import {
  StepItemProps,
  StepListProps,
  StepPanelContentContext,
  StepPanelProps,
  StepPanelsProps,
  StepperProps,
  StepperSeparatorProps,
  StepProps,
} from './stepper.types';
import styles from './stepper.module.scss';

export function Stepper({
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  linear = false,
  children,
  className = '',
}: StepperProps) {
  const [internalValue, setInternalValue] = useState<number>(defaultValue);

  const activeStep =
    controlledValue !== undefined ? controlledValue : internalValue;

  const updateValue = useCallback(
    (next: number) => {
      if (controlledValue === undefined) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [controlledValue, onValueChange]
  );

  const isStepActive = useCallback(
    (value: number) => activeStep === value,
    [activeStep]
  );

  const isStepCompleted = useCallback(
    (value: number) => activeStep > value,
    [activeStep]
  );

  // Collect step metadata from children for context (used by separator visibility)
  const steps = useMemo(() => {
    const collected: { label: string; value: number }[] = [];
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      // StepList → Step children
      React.Children.forEach(
        (child.props as any).children,
        (inner: React.ReactNode) => {
          if (React.isValidElement(inner)) {
            const props = inner.props as any;
            if (typeof props.value === 'number') {
              collected.push({ label: '', value: props.value });
            }
          }
        }
      );
    });
    return collected;
  }, [children]);

  const contextValue = useMemo(
    () => ({ activeStep, linear, updateValue, isStepActive, isStepCompleted, steps }),
    [activeStep, linear, updateValue, isStepActive, isStepCompleted, steps]
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        role="tablist"
        className={`${styles.root} ${className}`}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}

export function StepperSeparator({ className = '' }: StepperSeparatorProps) {
  return <div className={`${styles.separator} ${className}`} />;
}

export function StepList({ children, className = '' }: StepListProps) {
  return (
    <div className={`${styles.stepList} ${className}`}>
      {children}
    </div>
  );
}

export function StepItem({ value, children, className = '' }: StepItemProps) {
  const { isStepActive } = useStepperContext();
  const active = isStepActive(value);

  // Inject `value` into Step and StepPanel children automatically
  const injected = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child as React.ReactElement<any>, { value });
  });

  return (
    <div
      className={`${styles.stepItem} ${className}`}
      data-p-active={active}
    >
      {injected}
    </div>
  );
}

export function Step({ value, disabled = false, children, className = '' }: StepProps) {
  const { isStepActive, isStepCompleted, linear, updateValue, activeStep } =
    useStepperContext();

  const active = isStepActive(value);
  const completed = isStepCompleted(value);
  const isDisabled = !active && (linear || disabled);

  const handleClick = () => {
    if (!isDisabled) updateValue(value);
  };

  return (
    <div
      role="presentation"
      className={`${styles.step} ${className}`}
      aria-current={active ? 'step' : undefined}
      data-p-active={active}
      data-p-disabled={isDisabled}
    >
      <button
        id={`stepper_step_${value}`}
        role="tab"
        type="button"
        className={`${styles.stepHeader} ${active ? styles.stepHeaderActive : ''} ${completed ? styles.stepHeaderCompleted : ''}`}
        aria-controls={`stepper_steppanel_${value}`}
        tabIndex={isDisabled ? -1 : undefined}
        disabled={isDisabled}
        onClick={handleClick}
      >
        <span className={`${styles.stepNumber} ${active ? styles.stepNumberActive : ''} ${completed ? styles.stepNumberCompleted : ''}`}>
          {completed ? (
            <CheckIcon />
          ) : (
            value + 1
          )}
        </span>
        <span className={`${styles.stepTitle} ${active ? styles.stepTitleActive : ''}`}>
          {children}
        </span>
      </button>
    </div>
  );
}

export function StepPanels({ children, className = '' }: StepPanelsProps) {
  return (
    <div className={`${styles.stepPanels} ${className}`}>
      {children}
    </div>
  );
}

export function StepPanel({ value, children, className = '' }: StepPanelProps) {
  const { activeStep, updateValue } = useStepperContext();
  const active = activeStep === value;

  const context: StepPanelContentContext = {
    activateCallback: updateValue,
    value,
    active,
  };

  return (
    <div
      role="tabpanel"
      id={`stepper_steppanel_${value}`}
      aria-labelledby={`stepper_step_${value}`}
      data-p-active={active}
      className={`${styles.stepPanel} ${active ? styles.stepPanelActive : ''} ${className}`}
    >
      <div className={styles.stepPanelContentWrapper}>
        <div className={styles.stepPanelContent}>
          {typeof children === 'function' ? children(context) : children}
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
