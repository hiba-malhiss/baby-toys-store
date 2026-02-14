import React from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Card, Flex, Select, Option, Button } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../../components/FormFieldWrapper/FormFieldWrapper';
import { useAttributeTypeAdmin } from '../../../api/attributeApi';

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
  const numericTypeId = Number(typeId) || undefined;
  const currentType = attributeTypes.find((t) => t.id === Number(typeId));
  const { data: attributeType } = useAttributeTypeAdmin(numericTypeId);
  const isMulti = !!(attributeType?.isMultiselect ?? currentType?.isMultiselect);
  const valueOptions = ((attributeType?.values ?? currentType?.values) || []).filter(
    (v: any) => v.isActive
  );
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
              label={t('productForm.attributeType', 'Attribute Type')}
              fullWidth
              required
            >
              <Select
                value={field.value != null ? String(field.value) : ''}
                onChange={(v) => {
                  field.onChange(v);
                  setValue(`attributes.${index}.valueIds` as any, []);
                }}
                placeholder={t('productForm.selectAttributeType', 'Select attribute type')}
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
              label={t('productForm.attributeValues', 'Attribute Values')}
              fullWidth
              required={!!typeId}
            >
              <Select
                placeholder={t('productForm.selectValues', 'Select values')}
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
          {t('common.remove', 'Remove')}
        </Button>
      </Flex>
    </Card>
  );
};

export default AttributeRow;
