import { createContext, useContext } from 'react';
import { StepperContextValue } from './stepper.types';

export const StepperContext = createContext<StepperContextValue | null>(null);

export function useStepperContext(): StepperContextValue {
  const ctx = useContext(StepperContext);
  if (!ctx) {
    throw new Error('Stepper child components must be used inside a <Stepper> component.');
  }
  return ctx;
}
