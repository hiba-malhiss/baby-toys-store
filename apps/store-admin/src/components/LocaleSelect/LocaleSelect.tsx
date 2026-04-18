import React from 'react';
import { Select } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../FormFieldWrapper/FormFieldWrapper.tsx';
import type { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocales } from '../../hooks/useLocales';

type LocaleSelectProps = {
  name?: string;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  control?: Control<any>;
};

export const LocaleSelect: React.FC<LocaleSelectProps> = ({
  name = 'locale',
  label,
  required = true,
  fullWidth = true,
  control,
}) => {
  const { t } = useTranslation();
  const locales = useLocales();
  const resolvedLabel = label ?? t('language.label');

  const localeOptions = locales.map((code) => ({
    label: code.toUpperCase(),
    value: code,
  }));

  return (
    <FormFieldWrapper
      required={required}
      control={control}
      name={name}
      label={resolvedLabel}
      fullWidth={fullWidth}
    >
      <Select options={localeOptions} placeholder={t('language.selectPlaceholder')} />
    </FormFieldWrapper>
  );
};

export default LocaleSelect;
