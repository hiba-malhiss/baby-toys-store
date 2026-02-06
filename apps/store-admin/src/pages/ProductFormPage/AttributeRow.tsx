import React from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Card, Flex, Select, Option, Button } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';

interface AttributeRowProps {
  index: number;
  control: any;
  attributeTypes: any[];
  isDisabled: boolean;
  onRemove: () => void;
  setValue: (name: any, value: any) => void;
  selectedTypeIds: number[];
}

const AttributeRow: React.FC<AttributeRowProps> = ({
  index,
  control,
  attributeTypes,
  isDisabled,
  onRemove,
  setValue,
  selectedTypeIds,
}) => {
  const { t } = useTranslation();
  const typeId = useWatch({ control, name: `attributes.${index}.attributeTypeId` as const });
  const currentType = attributeTypes.find((t) => t.id === Number(typeId));
  const isMulti = !!currentType?.isMultiselect;
  const valueOptions = (currentType?.values || []).filter((v: any) => v.isActive);
  const availableTypes = attributeTypes.filter(
    (t) => !selectedTypeIds.includes(Number(t.id)) || Number(t.id) === Number(typeId)
  );

  return (
    <Card fullWidth size="xsmall">
      <Flex spacing="l" align="end" wrap>
        <Controller
          name={`attributes.${index}.attributeTypeId` as any}
          control={control}
          render={({ field }) => (
            <FormFieldWrapper
              label={t('productForm.attributeType', { defaultValue: 'Attribute Type' })}
              fullWidth
              required
            >
              <Select
                value={field.value != null ? String(field.value) : ''}
                onChange={(v) => {
                  field.onChange(v);
                  // reset values when type changes
                  setValue(`attributes.${index}.valueIds` as any, []);
                }}
                fullWidth
                isDisabled={isDisabled}
                clearable
              >
                {availableTypes.map((t) => {
                  const tr = t.translations || [];
                  const en = tr.find((x: any) => (x?.locale || '').toLowerCase() === 'en');
                  const label = en?.displayName || t.displayName || t.code;
                  return (
                    <Option key={t.id} value={String(t.id)}>
                      {label}
                    </Option>
                  );
                })}
              </Select>
            </FormFieldWrapper>
          )}
        />

        <Controller
          name={`attributes.${index}.valueIds` as any}
          control={control}
          render={({ field }) => (
            <FormFieldWrapper
              label={t('productForm.attributeValues', { defaultValue: 'Values' })}
              fullWidth
            >
              <Select
                value={
                  isMulti
                    ? Array.isArray(field.value)
                      ? field.value.map(String)
                      : []
                    : Array.isArray(field.value) && field.value.length > 0
                      ? String(field.value[0])
                      : ''
                }
                onChange={(vals) => {
                  if (isMulti) {
                    field.onChange(Array.isArray(vals) ? vals : vals ? [vals] : []);
                  } else {
                    field.onChange(vals ? [vals as string] : []);
                  }
                }}
                fullWidth
                isDisabled={isDisabled || !currentType}
                multiple={isMulti}
                clearable
                isSearchableInternally
              >
                {valueOptions.map((v: any) => {
                  const tr = v.translations || [];
                  const en = tr.find((x: any) => (x?.locale || '').toLowerCase() === 'en');
                  const label = en?.displayValue || v.display || v.code;
                  return (
                    <Option key={v.id} value={String(v.id)}>
                      {label}
                    </Option>
                  );
                })}
              </Select>
            </FormFieldWrapper>
          )}
        />

        <Button appearance="outline" onClick={onRemove}>
          {t('app.remove', { defaultValue: 'Remove' })}
        </Button>
      </Flex>
    </Card>
  );
};

export default AttributeRow;
