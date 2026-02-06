import React from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { Button, Flex } from '@baby-toys/ui-kit';
import AttributeRow from './AttributeRow';
import { useTranslation } from 'react-i18next';

interface AttributesSectionProps {
  control: any;
  attributeTypes: any[];
  isDisabled: boolean;
  setValue: (name: any, value: any) => void;
}

const AttributesSection: React.FC<AttributesSectionProps> = ({
  control,
  attributeTypes,
  isDisabled,
  setValue,
}) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({ name: 'attributes', control });

  const attrWatch = useWatch({ control, name: 'attributes' as const }) || [];
  const selectedTypeIds = (Array.isArray(attrWatch) ? attrWatch : [])
    .map((a: any) => Number(a?.attributeTypeId))
    .filter((n) => Number.isFinite(n));

  const remainingTypesCount = (attributeTypes || []).filter(
    (t: any) => !selectedTypeIds.includes(Number(t.id))
  ).length;
  const isAddDisabled = remainingTypesCount === 0 || fields.length >= (attributeTypes?.length || 0);

  return (
    <Flex direction="vertical" spacing="m" fullWidth>
      {fields.map((field, idx) => (
        <AttributeRow
          key={field.id}
          index={idx}
          control={control}
          attributeTypes={attributeTypes}
          isDisabled={isDisabled}
          onRemove={() => remove(idx)}
          setValue={setValue}
          selectedTypeIds={selectedTypeIds}
        />
      ))}
      <Button
        appearance="outline"
        isDisabled={isAddDisabled}
        onClick={() => append({ attributeTypeId: undefined as any, valueIds: [] })}
      >
        {t('productForm.addAttribute', { defaultValue: 'Add Attribute' })}
      </Button>
    </Flex>
  );
};

export default AttributesSection;
