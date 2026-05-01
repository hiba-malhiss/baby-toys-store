import React from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import AttributeRow from './AttributeRow';
import styles from '../Productsform.module.scss';

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
    <div className={styles.tagsSection}>
      <div className={styles.tagsSectionHeader}>
        <div className={styles.tagsSectionInfo}>
          <span className={styles.tagsSectionTitle}>
            {t('productForm.attributes', 'Attributes')}
          </span>
          <span className={styles.tagsSectionDesc}>
            {t(
              'productForm.attributesSubtitle',
              'Fixed specs like Material, Brand — shown on product page and used for filtering.'
            )}
          </span>
        </div>
        <button
          type="button"
          className={styles.addRowBtn}
          disabled={isAddDisabled || isDisabled}
          onClick={() => append({ attributeTypeId: undefined as any, valueIds: [] })}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1V13M1 7H13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {t('productForm.addAttribute', 'Add Attribute')}
        </button>
      </div>

      {fields.length > 0 ? (
        <div className={styles.rowsList}>
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
        </div>
      ) : (
        <div className={styles.emptyRowsHint}>
          {t(
            'productForm.noAttributes',
            'No attributes added yet. Click "Add Attribute" to start.'
          )}
        </div>
      )}
    </div>
  );
};

export default AttributesSection;
