import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Flex,
  StringInput,
  Table,
  BouncingDotsLoader,
  Dialog,
  FieldWrapper,
  ConfirmDialog,
} from '@baby-toys/ui-kit';
import type { OptionType, OptionValue } from '../../api/types/option';
import { useOptionValues, useCreateOptionValue, useUpdateOptionValue, useDeleteOptionValue } from '../../api/optionApi';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@baby-toys/ui-kit';

type Props = {
  activeType: OptionType;
};

const OptionsValuesRow: React.FC<Props> = ({ activeType }) => {
  const { t } = useTranslation();
  const typeId = activeType.id;
  const { data: values = [], isLoading: loadingValues } = useOptionValues(typeId);
  const createValue = useCreateOptionValue(typeId);
  const deleteValue = useDeleteOptionValue(typeId);
  const [showAdd, setShowAdd] = React.useState(false);
  const [newValue, setNewValue] = React.useState('');
  const [newDisplay, setNewDisplay] = React.useState('');
  const toast = useToast();

  // Edit/Delete state
  const [editRow, setEditRow] = React.useState<OptionValue | null>(null);
  const [editVal, setEditVal] = React.useState('');
  const [editDisp, setEditDisp] = React.useState<string>('');
  const [deleteRow, setDeleteRow] = React.useState<OptionValue | null>(null);

  const closeAdd = () => {
    setShowAdd(false);
    setNewValue('');
    setNewDisplay('');
  };

  const handleCreateValue = async () => {
    const value = newValue.trim();
    if (!value) return;

    try {
      await createValue.mutateAsync({
        value,
        display: newDisplay.trim() || undefined,
      });
      toast.success(t('common.create', { defaultValue: 'Create' }));
      closeAdd();
    } catch (e: any) {
      toast.error(e?.message || t('app.unexpectedError'));
    }
  };

  const handleOpenEdit = (row: OptionValue) => {
    setEditRow(row);
    setEditVal(row.value || '');
    setEditDisp(row.display || '');
  };

  const handleSaveEdit = async () => {
    if (!editRow) return;
    const payload: { value?: string; display?: string | null } = {};
    const v = editVal.trim();
    const d = editDisp.trim();
    if (v !== (editRow.value || '')) payload.value = v;
    payload.display = d || null;

    const update = useUpdateOptionValue(typeId, editRow.id);
    try {
      await update.mutateAsync(payload);
      toast.success(t('common.update', { defaultValue: 'Update' }));
      setEditRow(null);
    } catch (e: any) {
      toast.error(e?.message || t('app.unexpectedError'));
    }
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
            <Button appearance="outline" size="small" onClick={() => setShowAdd(true)}>
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

      <Dialog
        header={t('options.addValue', { defaultValue: 'Add Value' })}
        visible={showAdd}
        onVisibleChange={setShowAdd as any}
        dismissibleMask
        modal
      >
        <Flex direction="vertical" spacing="m">
          <Flex spacing="m">
            <FieldWrapper label="value" required>
              <StringInput
                placeholder={t('options.value', { defaultValue: 'Value' })}
                value={newValue}
                onChange={(v) => setNewValue(String(v ?? ''))}
              />
            </FieldWrapper>
            <FieldWrapper label="display">
              <StringInput
                placeholder={t('options.display', { defaultValue: 'Display (optional)' })}
                value={newDisplay}
                onChange={(v) => setNewDisplay(String(v ?? ''))}
              />
            </FieldWrapper>
          </Flex>
          <Flex justify="end" spacing="s">
            <Button appearance="outline" onClick={closeAdd}>
              {t('app.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button
              onClick={handleCreateValue}
              isLoading={createValue.isPending}
              isDisabled={!newValue.trim()}
            >
              {t('app.save', { defaultValue: 'Save' })}
            </Button>
          </Flex>
        </Flex>
      </Dialog>

      {/* Edit value dialog */}
      <Dialog
        header={t('common.edit', { defaultValue: 'Edit' })}
        visible={!!editRow}
        onVisibleChange={(vis: boolean) => !vis && setEditRow(null)}
        dismissibleMask
        modal
      >
        <Flex direction="vertical" spacing="m">
          <Flex spacing="m">
            <FieldWrapper label="value" required>
              <StringInput
                placeholder={t('options.value', { defaultValue: 'Value' })}
                value={editVal}
                onChange={(v) => setEditVal(String(v ?? ''))}
              />
            </FieldWrapper>
            <FieldWrapper label="display">
              <StringInput
                placeholder={t('options.display', { defaultValue: 'Display (optional)' })}
                value={editDisp}
                onChange={(v) => setEditDisp(String(v ?? ''))}
              />
            </FieldWrapper>
          </Flex>
          <Flex justify="end" spacing="s">
            <Button appearance="outline" onClick={() => setEditRow(null)}>
              {t('app.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button onClick={handleSaveEdit} isDisabled={!editVal.trim()}>
              {t('app.save', { defaultValue: 'Save' })}
            </Button>
          </Flex>
        </Flex>
      </Dialog>

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
