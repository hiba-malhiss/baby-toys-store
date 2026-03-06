import React, { type ReactElement } from 'react';
import { Controller, type Control, type FieldValues } from 'react-hook-form';
import { FieldWrapper } from '@baby-toys/ui-kit';

interface FormFieldWrapperProps<T extends FieldValues> {
  name?: string;
  control?: Control<T>;
  children: ReactElement;
  label: string;
  className?: string;
  fullWidth?: boolean;
  required?: boolean;
  rules?: any;
  error?: string;
}

function FormFieldWrapper<T extends FieldValues>({
  name,
  control,
  children,
  label,
  className,
  fullWidth,
  required,
  rules,
  error,
}: FormFieldWrapperProps<T>) {
  if (control) {
    // Use Controller only if control is provided
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState, formState }) => {
          // Try to detect descendant errors for array/object fields
          const allErrors = (formState as any)?.errors;
          const segments = (name || '').split('.').filter(Boolean);

          const getAtPath = (obj: any, segs: string[]) =>
            segs.reduce((acc: any, key: string) => (acc && acc[key] != null ? acc[key] : undefined), obj);

          const findFirstMessage = (node: any): string | undefined => {
            if (!node) return undefined;
            if (typeof node?.message === 'string') return node.message;
            if (typeof node === 'string') return node;
            if (Array.isArray(node)) {
              for (const child of node) {
                const m = findFirstMessage(child);
                if (m) return m;
              }
            } else if (typeof node === 'object') {
              for (const k of Object.keys(node)) {
                const m = findFirstMessage(node[k]);
                if (m) return m;
              }
            }
            return undefined;
          };

          const descendantNode = getAtPath(allErrors, segments);
          const descendantMessage = fieldState.error?.message || findFirstMessage(descendantNode);
          const hasAnyError = !!(fieldState.error || descendantMessage);

          return (
            <FieldWrapper
              label={label}
              error={descendantMessage}
              className={className}
              fullWidth={fullWidth}
              required={required}
            >
              {React.cloneElement(children, {
                ...field,
                fullWidth: fullWidth,
                hasError: hasAnyError,
                id: name,
              })}
            </FieldWrapper>
          );
        }}
      />
    );
  }

  // If no control, render children directly
  return (
    <FieldWrapper
      label={label}
      className={className}
      fullWidth={fullWidth}
      required={required}
      error={error}
    >
      {React.cloneElement(children, { fullWidth })}
    </FieldWrapper>
  );
}

export default FormFieldWrapper;
