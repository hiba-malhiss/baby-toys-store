import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Table, BouncingDotsLoader, ConfirmDialog } from '@baby-toys/ui-kit';
import type {
  OptionTypeDto as OptionType,
  OptionValueDto as OptionValue,
} from '../../api/types/option';
import { useOptionTypeDetail, useDeleteOptionValue } from '../../api/optionApi';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@baby-toys/ui-kit';
import ValueUpsertDialog from './ValueUpsertDialog';

type Props = {
  activeType: OptionType;
};

const OptionsValuesRow: React.FC<Props> = ({ activeType }) => {
  const { t } = useTranslation();
  const typeId = activeType.id;
  const { data: typeDetail, isLoading: loadingValues } = useOptionTypeDetail(typeId);
  const values: OptionValue[] = (typeDetail?.values as any) || [];
  const deleteValue = useDeleteOptionValue(typeId);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const toast = useToast();

  // Edit/Delete state
  const [editRow, setEditRow] = React.useState<OptionValue | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<OptionValue | null>(null);

  const openAdd = () => {
    setEditRow(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (row: OptionValue) => {
    setEditRow(row);
    setDialogOpen(true);
  };

  if (loadingValues) {
    return <BouncingDotsLoader />;
  }

  return (
    <>
      <Table
        value={values}
        rows={values.length || 1}
        title={
          <Flex justify="end" align="center" fullWidth>
            <Button appearance="outline" size="small" onClick={openAdd}>
              {t('options.addValue', { defaultValue: 'Add Value' })}
            </Button>
          </Flex>
        }
        columns={[
          {
            header: t('options.value', { defaultValue: 'Value' }),
            field: 'value',
            filter: true,
            sortable: true,
          },
          {
            header: t('options.display', { defaultValue: 'Display' }),
            field: 'display',
            filter: true,
            sortable: true,
          },
          {
            header: t('app.actions', { defaultValue: 'Actions' }),
            field: 'actions',
            body: (row: OptionValue) => (
              <Flex spacing="m">
                <Button
                  size="small"
                  appearance="outline"
                  leftIconComp={Pencil}
                  aria-label={t('common.edit', { defaultValue: 'Edit' })}
                  onClick={() => handleOpenEdit(row)}
                />
                <Button
                  size="small"
                  appearance="outline"
                  color="secondary"
                  leftIconComp={Trash2}
                  aria-label={t('common.delete', { defaultValue: 'Delete' })}
                  onClick={() => setDeleteRow(row)}
                />
              </Flex>
            ),
          },
        ]}
        paginator={false}
        stripedRows
        emptyMessage={t('options.noValues', { defaultValue: 'No values' })}
        useLocalSortAndFilter
        rowHover
      />

      <ValueUpsertDialog
        visible={dialogOpen}
        mode={editRow ? 'edit' : 'create'}
        typeId={typeId}
        initial={editRow as any}
        onClose={() => setDialogOpen(false)}
        onSuccess={() =>
          toast.success(
            t(editRow ? 'common.update' : 'common.create', {
              defaultValue: editRow ? 'Update' : 'Create',
            })
          )
        }
      />

      {/* Delete confirm */}
      <ConfirmDialog
        visible={!!deleteRow}
        header={t('common.confirmDeleteTitle', { defaultValue: 'Confirm Delete' })}
        message={t('categories.deleteConfirm', {
          defaultValue: 'Are you sure you want to delete “{{name}}”?',
          name: deleteRow?.display || deleteRow?.value,
        })}
        onConfirm={async () => {
          if (!deleteRow) return;
          try {
            await deleteValue.mutateAsync(deleteRow.id);
            toast.success(t('common.delete', { defaultValue: 'Delete' }));
            setDeleteRow(null);
          } catch (e: any) {
            toast.error(e?.message || t('app.unexpectedError'));
          }
        }}
        onCancel={() => setDeleteRow(null)}
      />
    </>
  );
};

export default OptionsValuesRow;
