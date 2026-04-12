export interface StepItem {
  label: string;
  value: number;
}

export interface StepperContextValue {
  activeStep: number;
  linear: boolean;
  updateValue: (value: number) => void;
  isStepActive: (value: number) => boolean;
  isStepCompleted: (value: number) => boolean;
  steps: StepItem[];
}

export interface StepperProps {
  /** Controlled active step value (0-based index) */
  value?: number;
  /** Default active step for uncontrolled mode */
  defaultValue?: number;
  /** Fires when the active step changes */
  onValueChange?: (value: number) => void;
  /** When true, only allows sequential navigation */
  linear?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface StepListProps {
  children: React.ReactNode;
  className?: string;
}

export interface StepItemProps {
  value: number;
  children: React.ReactNode;
  className?: string;
}

export interface StepProps {
  value: number;
  /** Explicitly disable this step */
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface StepPanelsProps {
  children: React.ReactNode;
  className?: string;
}

export interface StepPanelProps {
  value: number;
  children: React.ReactNode | ((ctx: StepPanelContentContext) => React.ReactNode);
  className?: string;
}

export interface StepPanelContentContext {
  /** Call with a step value to jump to that step */
  activateCallback: (value: number) => void;
  value: number;
  active: boolean;
}

export interface StepContentContext {
  activateCallback: () => void;
  value: number;
  active: boolean;
}

export interface StepperSeparatorProps {
  className?: string;
}
