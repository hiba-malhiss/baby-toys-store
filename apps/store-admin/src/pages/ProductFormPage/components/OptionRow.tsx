import React from 'react';
import { useWatch } from 'react-hook-form';
import { useOptionTypeDetail } from '../../../api/optionApi.ts';
import { useTranslation } from 'react-i18next';
import { Flex, Option, Select } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../../components/FormFieldWrapper/FormFieldWrapper.tsx';

const OptionRow: React.FC<{
  index: number;
  control: any;
  isDisabled: boolean;
  setValue: (name: any, value: any) => void;
  optionTypes: any[];
  selectedTypeIds: number[];
}> = ({ index, control, isDisabled, setValue, optionTypes, selectedTypeIds }) => {
  const currentTypeId = useWatch({
    control,
    name: `options.${index}.optionTypeId` as const,
  });
  const numericTypeId = Number(currentTypeId) || undefined;
  const { data: optionType } = useOptionTypeDetail(numericTypeId);
  const values = optionType?.values || [];
  const { t } = useTranslation();

  return (
    <Flex spacing="m" align="start" fullWidth wrap>
      <FormFieldWrapper label={t('productForm.optionType', 'Option Type')} fullWidth required>
        <Select
          placeholder={t('productForm.selectOptionType', 'Select option type')}
          value={numericTypeId}
          onChange={(v) => {
            const id = Number(v);
            setValue(`options.${index}.optionTypeId`, id);
            setValue(`options.${index}.valueIds`, []);
          }}
          isDisabled={isDisabled}
        >
          {optionTypes
            .filter((t: any) =>
              selectedTypeIds.includes(Number(t.id)) ? Number(t.id) === numericTypeId : true
            )
            .map((t: any) => (
              <Option key={t.id} value={t.id}>
                {t.name}
              </Option>
            ))}
        </Select>
      </FormFieldWrapper>
      <FormFieldWrapper label={t('productForm.optionValues', 'Option Values')} fullWidth required>
        <Select
          multiple
          placeholder={t('productForm.selectValues', 'Select values')}
          value={
            (useWatch({ control, name: `options.${index}.valueIds` as const }) as number[]) || []
          }
          onChange={(vals) =>
            setValue(
              `options.${index}.valueIds`,
              (Array.isArray(vals) ? vals : [vals]).map((n) => Number(n))
            )
          }
          isDisabled={isDisabled || !numericTypeId}
        >
          {values.map((v: any) => (
            <Option key={v.id} value={v.id}>
              {v.display || v.value}
            </Option>
          ))}
        </Select>
      </FormFieldWrapper>
    </Flex>
  );
};

export default OptionRow;
