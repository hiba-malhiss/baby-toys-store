import React from 'react';
import { Control } from 'react-hook-form';
import { Flex, StringInput, TextArea, StringArrayInput, KeyValueArrayInput } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';

export type LocalizedFieldsProps = {
  control: Control<any>;
  locale: 'en' | 'ar';
  isDisabled?: boolean;
};

const LocalizedFields: React.FC<LocalizedFieldsProps> = ({ control, locale, isDisabled }) => {
  const labelSuffix = `(${locale})`;
  const base = `translations.${locale}`;

  return (
    <Flex direction="vertical" spacing="xxl" fullWidth>
      <FormFieldWrapper
        name={`${base}.name`}
        control={control}
        label={`Product name ${labelSuffix}`}
        fullWidth
        required
      >
        <StringInput placeholder="Enter product name" disabled={!!isDisabled} />
      </FormFieldWrapper>

      <FormFieldWrapper
        name={`${base}.shortDescription`}
        control={control}
        label={`Short Description ${labelSuffix}`}
        fullWidth
        required
      >
        <TextArea placeholder="Enter a short description" disabled={!!isDisabled} />
      </FormFieldWrapper>

      <FormFieldWrapper
        name={`${base}.description`}
        control={control}
        label={`Description ${labelSuffix}`}
        fullWidth
      >
        <TextArea placeholder="Enter a full description" disabled={!!isDisabled} />
      </FormFieldWrapper>

      <FormFieldWrapper
        name={`${base}.details`}
        control={control}
        label={`Product Details ${labelSuffix}`}
        fullWidth
      >
        <KeyValueArrayInput
          keyPlaceholder="Label"
          valuePlaceholder="Value"
          addButtonText="Add detail"
          fullWidth
          disabled={!!isDisabled}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        name={`${base}.featureBullets`}
        control={control}
        label={`Feature Bullets ${labelSuffix}`}
        fullWidth
      >
        <StringArrayInput
          placeholder="Add bullet"
          addButtonText="Add bullet"
          min={1}
          max={10}
          fullWidth
          disabled={!!isDisabled}
        />
      </FormFieldWrapper>
    </Flex>
  );
};

export default LocalizedFields;
