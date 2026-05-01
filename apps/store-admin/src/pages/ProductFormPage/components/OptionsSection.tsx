import React from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOptionTypes } from '../../../api/optionApi';
import OptionRow from './OptionRow.tsx';
import styles from '../Productsform.module.scss';

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
    <div className={styles.tagsSection}>
      <div className={styles.tagsSectionHeader}>
        <div className={styles.tagsSectionInfo}>
          <span className={styles.tagsSectionTitle}>{t('productForm.options', 'Options')}</span>
          <span className={styles.tagsSectionDesc}>
            {t(
              'productForm.optionsSubtitle',
              'Purchasable variants like Size, Color — each combination becomes a buyable variant with its own price and stock.'
            )}
          </span>
        </div>
        <button
          type="button"
          className={styles.addRowBtn}
          disabled={isAddDisabled || isDisabled}
          onClick={() => append({ optionTypeId: undefined as any, valueIds: [] })}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1V13M1 7H13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {t('productForm.addOption', 'Add Option')}
        </button>
      </div>

      {fields.length > 0 ? (
        <div className={styles.rowsList}>
          {fields.map((field, idx) => (
            <OptionRow
              key={field.id}
              index={idx}
              control={control}
              isDisabled={isDisabled}
              setValue={setValue}
              optionTypes={optionTypes}
              selectedTypeIds={selectedTypeIds}
              onRemove={() => remove(idx)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyRowsHint}>
          {t(
            'productForm.noOptions',
            'No options added yet. Add options like Size or Color to enable variants.'
          )}
        </div>
      )}
    </div>
  );
};

export default OptionsSection;
