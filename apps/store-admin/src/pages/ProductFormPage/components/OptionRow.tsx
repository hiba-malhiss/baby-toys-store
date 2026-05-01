import React from 'react';
import { useWatch } from 'react-hook-form';
import { useOptionTypeDetail } from '../../../api/optionApi.ts';
import { useTranslation } from 'react-i18next';
import { Button, Option, Select } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../../components/FormFieldWrapper/FormFieldWrapper.tsx';
import styles from '../Productsform.module.scss';
import { Trash2 } from 'lucide-react';

const OptionRow: React.FC<{
  index: number;
  control: any;
  isDisabled: boolean;
  setValue: (name: any, value: any) => void;
  optionTypes: any[];
  selectedTypeIds: number[];
  onRemove: () => void;
}> = ({ index, control, isDisabled, setValue, optionTypes, selectedTypeIds, onRemove }) => {
  const currentTypeId = useWatch({
    control,
    name: `options.${index}.optionTypeId` as const,
  });
  const numericTypeId = Number(currentTypeId) || undefined;
  const { data: optionType } = useOptionTypeDetail(numericTypeId);
  const values = optionType?.values || [];
  const { t } = useTranslation();

  const selectedValues =
    (useWatch({
      control,
      name: `options.${index}.valueIds` as const,
    }) as number[]) || [];

  return (
    <div className={styles.optionRow}>
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
          fullWidth
        >
          {optionTypes
            .filter((t: any) =>
              selectedTypeIds.includes(Number(t.id)) ? Number(t.id) === numericTypeId : true
            )
            .map((t: any) => (
              <Option key={t.id} value={t.id}>
                {t.displayName || t.translations?.[0]?.displayName || t.code}
              </Option>
            ))}
        </Select>
      </FormFieldWrapper>

      <FormFieldWrapper label={t('productForm.optionValues', 'Option Values')} fullWidth required>
        <Select
          multiple
          placeholder={
            !numericTypeId
              ? t('productForm.selectTypeFirst', 'Select type first')
              : t('productForm.selectValues', 'Select values')
          }
          value={selectedValues}
          onChange={(vals) =>
            setValue(
              `options.${index}.valueIds`,
              (Array.isArray(vals) ? vals : [vals]).map((n) => Number(n))
            )
          }
          isDisabled={isDisabled || !numericTypeId}
          fullWidth
        >
          {values.map((v: any) => (
            <Option key={v.id} value={v.id}>
              {v.translations?.[0]?.display || v.display || v.value}
            </Option>
          ))}
        </Select>
      </FormFieldWrapper>
      <Button
        size="small"
        className={styles.removeRowBtn}
        appearance="outline"
        leftIconComp={Trash2}
        aria-label={t('common.delete', { defaultValue: 'Delete' })}
        onClick={onRemove}
      />
    </div>
  );
};

export default OptionRow;
