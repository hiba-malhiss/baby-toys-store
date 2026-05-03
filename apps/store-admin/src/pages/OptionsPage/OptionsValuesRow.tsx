import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, BouncingDotsLoader, ConfirmDialog, useToast, ValueChip } from '@baby-toys/ui-kit';
import type {
  OptionTypeDto as OptionType,
  OptionValueDto as OptionValue,
} from '../../api/types/option';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useOptionTypeDetail, useDeleteOptionValue } from '../../api/optionApi';
import ValueUpsertDialog from './ValueUpsertDialog';
import styles from './options.module.scss';

type Props = { activeType: OptionType };

const OptionsValuesRow: React.FC<Props> = ({ activeType }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const typeId = activeType.id;
  const { data: typeDetail, isLoading: loadingValues } = useOptionTypeDetail(typeId);
  const values: OptionValue[] = (typeDetail?.values as any) || [];
  const deleteValue = useDeleteOptionValue(typeId);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState<OptionValue | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<OptionValue | null>(null);

  const getLabel = (v: OptionValue) => {
    const tr = (v as any).translations || [];
    const en = tr.find((x: any) => (x?.locale || '').toLowerCase() === 'en');
    return en?.display || v.display || v.value || '—';
  };

  const openAdd = () => {
    setEditRow(null);
    setDialogOpen(true);
  };
  const handleOpenEdit = (row: OptionValue) => {
    setEditRow(row);
    setDialogOpen(true);
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
          {t('options.values', { defaultValue: 'Values' })} ({values.length})
        </span>
        <Button appearance="outline" size="small" onClick={openAdd} leftIconComp={Plus}>
          {t('options.addValue', { defaultValue: 'Add Value' })}
        </Button>
      </div>

      <div className={styles.valuesGrid}>
        {values.map((v) => (
          <ValueChip
            key={v.id}
            label={getLabel(v)}
            code={v.value && v.value !== getLabel(v) ? v.value : undefined}
            onEdit={() => handleOpenEdit(v)}
            onDelete={() => setDeleteRow(v)}
          />
        ))}
      </div>

      <ValueUpsertDialog
        visible={dialogOpen}
        mode={editRow ? 'edit' : 'create'}
        typeId={typeId}
        initial={editRow as any}
        onClose={() => {
          setDialogOpen(false);
          setEditRow(null);
        }}
        onSuccess={() =>
          toast.success(
            t(editRow ? 'common.update' : 'common.create', {
              defaultValue: editRow ? 'Updated' : 'Created',
            })
          )
        }
      />

      <ConfirmDialog
        visible={!!deleteRow}
        header={t('common.confirmDeleteTitle', { defaultValue: 'Confirm Delete' })}
        message={t('categories.deleteConfirm', {
          defaultValue: 'Are you sure you want to delete "{{name}}"?',
          name: deleteRow ? getLabel(deleteRow) : '',
        })}
        onConfirm={async () => {
          if (!deleteRow) return;
          try {
            await deleteValue.mutateAsync(deleteRow.id);
            toast.success(t('common.delete', { defaultValue: 'Deleted' }));
            setDeleteRow(null);
          } catch (e: any) {
            toast.error(e?.message || t('app.unexpectedError'));
          }
        }}
        onCancel={() => setDeleteRow(null)}
      />
    </div>
  );
};

export default OptionsValuesRow;
