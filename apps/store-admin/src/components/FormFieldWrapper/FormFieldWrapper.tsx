import React, { type ReactElement } from 'react';
import { Controller, type Control, type FieldValues } from 'react-hook-form';
import { FieldWrapper } from '@baby-toys/ui-kit/components';

interface FormFieldWrapperProps<T extends FieldValues> {
  name: string;
  control?: Control<T>;
  children: ReactElement;
  label: string;
  className?: string;
  fullWidth?: boolean;
  required?: boolean;
}

function FormFieldWrapper<T extends FieldValues>({
  name,
  control,
  children,
  label,
  className,
  fullWidth,
  required,
}: FormFieldWrapperProps<T>) {
  if (control) {
    // Use Controller only if control is provided
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label={label}
            error={fieldState.error?.message}
            className={className}
            fullWidth={fullWidth}
            required={required}
          >
            {React.cloneElement(children, {
              ...field,
              fullWidth: fullWidth,
              hasError: fieldState.error?.message,
              id: name,
            })}
          </FieldWrapper>
        )}
      />
    );
  }

  // If no control, render children directly
  return (
    <FieldWrapper label={label} className={className} fullWidth={fullWidth} required={required}>
      {React.cloneElement(children, { fullWidth })}
    </FieldWrapper>
  );
}

export default FormFieldWrapper;
