import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, BouncingDotsLoader, ConfirmDialog, useToast, ValueChip } from '@baby-toys/ui-kit';
import type {
  AttributeTypeListDto as AttributeType,
  AttributeValueAdminDto as AttributeValue,
} from '../../api/types/attribute';
import { Plus } from 'lucide-react';
import { useAttributeTypeAdmin, useDeleteAttributeValue } from '../../api/attributeApi';
import ValueUpsertDialog from './ValueUpsertDialog';
import styles from './attributes.module.scss';

type Props = { activeType: AttributeType };

const AttributesValuesRow: React.FC<Props> = ({ activeType }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const typeId = activeType.id;
  const { data: typeAdmin, isLoading: loadingValues } = useAttributeTypeAdmin(typeId);
  const values = (typeAdmin?.values || []) as AttributeValue[];
  const deleteValueHook = useDeleteAttributeValue();
  const [showAdd, setShowAdd] = React.useState(false);
  const [editValue, setEditValue] = React.useState<AttributeValue | null>(null);
  const [deleteValue, setDeleteValue] = React.useState<AttributeValue | null>(null);

  const getLabel = (v: AttributeValue) => {
    const tr = v.translations || [];
    const en = tr.find((x: any) => (x?.locale || '').toLowerCase() === 'en');
    return en?.displayValue || v.display || v.code || '—';
  };
  const getArLabel = (v: AttributeValue) => {
    const tr = v.translations || [];
    const ar = tr.find((x: any) => (x?.locale || '').toLowerCase() === 'ar');
    return ar?.displayValue || null;
  };

  if (loadingValues)
    return (
      <div className={styles.valuesPanel}>
        <BouncingDotsLoader />
      </div>
    );

  return (
    <div className={styles.valuesPanel}>
      <div className={styles.valuesPanelHeader}>
        <span className={styles.valuesPanelTitle}>
          {t('attributes.values', { defaultValue: 'Values' })} ({values.length})
        </span>
        <Button appearance="outline" size="small" onClick={() => setShowAdd(true)}>
          <Plus size={12} />
          {t('attributes.addValue', { defaultValue: 'Add Value' })}
        </Button>
      </div>

      <div className={styles.valuesGrid}>
        {values.map((v) => (
          <ValueChip
            key={v.id}
            label={getLabel(v)}
            secondaryLabel={getArLabel(v)}
            code={v.code}
            inactive={!v.isActive}
            onEdit={() => setEditValue({ ...v })}
            onDelete={() => setDeleteValue(v)}
          />
        ))}
      </div>

      <ValueUpsertDialog
        mode={editValue ? 'edit' : 'create'}
        visible={showAdd || !!editValue}
        onClose={() => {
          setShowAdd(false);
          setEditValue(null);
        }}
        typeId={typeId}
        initial={editValue as any}
        onSuccess={() =>
          toast.success(
            t(editValue ? 'common.update' : 'common.create', {
              defaultValue: editValue ? 'Updated' : 'Created',
            })
          )
        }
      />

      <ConfirmDialog
        visible={!!deleteValue}
        header={t('common.confirmDeleteTitle', { defaultValue: 'Confirm Delete' })}
        message={t('categories.deleteConfirm', {
          defaultValue: 'Are you sure you want to delete "{{name}}"?',
          name: deleteValue ? getLabel(deleteValue) : '',
        })}
        onConfirm={async () => {
          if (!deleteValue) return;
          try {
            await deleteValueHook.mutateAsync(deleteValue.id);
            toast.success(t('common.delete', { defaultValue: 'Deleted' }));
            setDeleteValue(null);
          } catch (e: any) {
            toast.error(e?.message || t('app.unexpectedError'));
          }
        }}
        onCancel={() => setDeleteValue(null)}
      />
    </div>
  );
};

export default AttributesValuesRow;
