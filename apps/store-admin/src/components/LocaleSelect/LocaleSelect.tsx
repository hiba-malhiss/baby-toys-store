import React from 'react';
import { Select } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../FormFieldWrapper/FormFieldWrapper.tsx';
import { getSupportedLocales } from '../i18n/locale';
import type { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type LocaleSelectProps = {
  name?: string;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  control?: Control<T>;
};

const LOCALE_OPTIONS = getSupportedLocales().map((code) => ({
  label: code.toUpperCase(),
  value: code,
})) as any;

export const LocaleSelect: React.FC<LocaleSelectProps> = ({
  name = 'locale',
  label,
  required = true,
  fullWidth = true,
  control,
}) => {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('language.label');
  return (
    <FormFieldWrapper
      required={required}
      control={control}
      name={name}
      label={resolvedLabel}
      fullWidth={fullWidth}
    >
      <Select options={LOCALE_OPTIONS} placeholder={t('language.selectPlaceholder')} />
    </FormFieldWrapper>
  );
};

export default LocaleSelect;
