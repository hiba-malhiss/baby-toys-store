import React from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { Button, Flex, Select, Option, Card } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';
import { useOptionTypes, useOptionValues } from '../../api/optionApi';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';

interface OptionsSectionProps {
  control: any;
  isDisabled: boolean;
  setValue: (name: any, value: any) => void;
}

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
  const { data: values = [] } = useOptionValues(numericTypeId);
  const { t } = useTranslation();
  return (
    <Flex spacing="m" align="start" fullWidth wrap>
      <FormFieldWrapper label={t('productForm.optionType')} fullWidth required>
        <Select
          placeholder="Option Type"
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
      <FormFieldWrapper label={t('productForm.optionValues')} fullWidth required>
        <Select
          multiple
          placeholder="Values"
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

const OptionsSection: React.FC<OptionsSectionProps> = ({ control, isDisabled, setValue }) => {
  const { t } = useTranslation();
  const { data: optionTypes = [] } = useOptionTypes();
  const { fields, append, remove } = useFieldArray({ name: 'options', control });

  const optionsWatch = useWatch({ control, name: 'options' as const }) || [];
  const selectedTypeIds = (Array.isArray(optionsWatch) ? optionsWatch : [])
    .map((o: any) => Number(o?.optionTypeId))
    .filter((n) => Number.isFinite(n));

  const remainingTypesCount = (optionTypes || []).filter(
    (t: any) => !selectedTypeIds.includes(Number(t.id))
  ).length;
  const isAddDisabled = remainingTypesCount === 0 || fields.length >= (optionTypes?.length || 0);

  return (
    <Flex direction="vertical" spacing="m" fullWidth>
      {fields.map((field, idx) => (
        <Card key={field.id} fullWidth size="small">
          <Flex direction="vertical" spacing="s" fullWidth>
            <OptionRow
              index={idx}
              control={control}
              isDisabled={isDisabled}
              setValue={setValue}
              optionTypes={optionTypes}
              selectedTypeIds={selectedTypeIds}
            />
            <Button appearance="outline" onClick={() => remove(idx)} isDisabled={isDisabled}>
              {t('common.remove', { defaultValue: 'Remove' })}
            </Button>
          </Flex>
        </Card>
      ))}

      <Button
        appearance="outline"
        isDisabled={isAddDisabled || isDisabled}
        onClick={() => append({ optionTypeId: undefined as any, valueIds: [] })}
      >
        {t('productForm.addOption', { defaultValue: 'Add Option' })}
      </Button>
    </Flex>
  );
};

export default OptionsSection;
