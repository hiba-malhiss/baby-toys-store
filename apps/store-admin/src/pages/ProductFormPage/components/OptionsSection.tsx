import React from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { Button, Flex, Card } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';
import { useOptionTypes } from '../../../api/optionApi';
import OptionRow from './OptionRow.tsx';

interface OptionsSectionProps {
  control: any;
  isDisabled: boolean;
  setValue: (name: any, value: any) => void;
}

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
