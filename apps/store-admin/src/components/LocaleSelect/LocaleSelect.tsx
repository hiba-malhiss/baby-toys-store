import React from 'react';
import { Select } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../FormFieldWrapper/FormFieldWrapper.tsx';
import type { Control } from 'react-hook-form';

type LocaleSelectProps = {
  name?: string;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  control?: Control<T>;
};

const LOCALE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'العربية', value: 'ar' },
] as const;

export const LocaleSelect: React.FC<LocaleSelectProps> = ({
  name = 'locale',
  label = 'Language',
  required = true,
  fullWidth = true,
  control,
}) => {
  return (
    <FormFieldWrapper
      required={required}
      control={control}
      name={name}
      label={label}
      fullWidth={fullWidth}
    >
      <Select options={LOCALE_OPTIONS} placeholder="Select status" />
    </FormFieldWrapper>
  );
};

export default LocaleSelect;
