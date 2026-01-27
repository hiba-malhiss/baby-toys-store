import React from 'react';
import { Control } from 'react-hook-form';
import {
  Flex,
  StringInput,
  TextArea,
  StringArrayInput,
  KeyValueArrayInput,
} from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { useTranslation } from 'react-i18next';

export type LocalizedFieldsProps = {
  control: Control<any>;
  locale: string;
  isDisabled?: boolean;
};

const LocalizedFields: React.FC<LocalizedFieldsProps> = ({ control, locale, isDisabled }) => {
  const { t } = useTranslation();
  const labelSuffix = `(${locale})`;
  const base = `translations.${locale}`;

  return (
    <Flex direction="vertical" spacing="xxl" fullWidth>
      <FormFieldWrapper
        name={`${base}.name`}
        control={control}
        label={t('productForm.productName', { locale: labelSuffix })}
        fullWidth
        required
      >
        <StringInput
          placeholder={t('productForm.placeholders.productName')}
          isDisabled={!!isDisabled}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        name={`${base}.shortDescription`}
        control={control}
        label={t('productForm.shortDescription', { locale: labelSuffix })}
        fullWidth
        required
      >
        <TextArea
          placeholder={t('productForm.placeholders.shortDescription')}
          isDisabled={!!isDisabled}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        name={`${base}.description`}
        control={control}
        label={t('productForm.description', { locale: labelSuffix })}
        fullWidth
      >
        <TextArea
          placeholder={t('productForm.placeholders.description')}
          isDisabled={!!isDisabled}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        name={`${base}.details`}
        control={control}
        label={t('productForm.productDetails', { locale: labelSuffix })}
        fullWidth
      >
        <KeyValueArrayInput
          keyPlaceholder={t('productForm.placeholders.detailLabel')}
          valuePlaceholder={t('productForm.placeholders.detailValue')}
          addButtonText={t('productForm.buttons.addDetail')}
          fullWidth
          isDisabled={!!isDisabled}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        name={`${base}.featureBullets`}
        control={control}
        label={t('productForm.featureBullets', { locale: labelSuffix })}
        fullWidth
      >
        <StringArrayInput
          placeholder={t('productForm.placeholders.bullet')}
          addButtonText={t('productForm.buttons.addBullet')}
          min={1}
          max={10}
          fullWidth
          isDisabled={!!isDisabled}
          textarea
        />
      </FormFieldWrapper>
    </Flex>
  );
};

export default LocalizedFields;
