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
import {
  useOptionValues,
  useCreateOptionValue,
  useUpdateOptionValue,
  useDeleteOptionValue,
} from '../../api/optionApi';
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
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [formVal, setFormVal] = React.useState('');
  const [formDisp, setFormDisp] = React.useState('');
  const toast = useToast();

  // Edit/Delete state
  const [editRow, setEditRow] = React.useState<OptionValue | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<OptionValue | null>(null);
  // Bind update hook to current edit row id (0 when none) so we don't create hooks inside handlers
  const currentEditId = editRow?.id ?? 0;
  const updateValue = useUpdateOptionValue(typeId, currentEditId);

  const openAdd = () => {
    setEditRow(null);
    setFormVal('');
    setFormDisp('');
    setDialogOpen(true);
  };

  const handleOpenEdit = (row: OptionValue) => {
    setEditRow(row);
    setFormVal(row.value || '');
    setFormDisp(row.display || '');
    setDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    const v = formVal.trim();
    const d = formDisp.trim();
    if (!v) return;
    try {
      if (editRow) {
        const payload: { value?: string; display?: string | null } = {};
        if (v !== (editRow.value || '')) payload.value = v;
        payload.display = d || null;
        await updateValue.mutateAsync(payload);
        toast.success(t('common.update', { defaultValue: 'Update' }));
      } else {
        await createValue.mutateAsync({ value: v, display: d || undefined });
        toast.success(t('common.create', { defaultValue: 'Create' }));
      }
      setDialogOpen(false);
      setEditRow(null);
      setFormVal('');
      setFormDisp('');
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

      {/* Unified Add/Edit dialog */}
      <Dialog
        header={
          editRow
            ? t('common.edit', { defaultValue: 'Edit' })
            : t('options.addValue', { defaultValue: 'Add Value' })
        }
        visible={dialogOpen}
        onVisibleChange={setDialogOpen as any}
        dismissibleMask
        modal
      >
        <Flex direction="vertical" spacing="m">
          <Flex spacing="m">
            <FieldWrapper label="value" required>
              <StringInput
                placeholder={t('options.value', { defaultValue: 'Value' })}
                value={formVal}
                onChange={(v) => setFormVal(String(v ?? ''))}
              />
            </FieldWrapper>
            <FieldWrapper label="display">
              <StringInput
                placeholder={t('options.display', { defaultValue: 'Display (optional)' })}
                value={formDisp}
                onChange={(v) => setFormDisp(String(v ?? ''))}
              />
            </FieldWrapper>
          </Flex>
          <Flex justify="end" spacing="s">
            <Button appearance="outline" onClick={() => setDialogOpen(false)}>
              {t('app.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button
              onClick={handleSaveEdit}
              isLoading={editRow ? updateValue.isPending : createValue.isPending}
              isDisabled={!formVal.trim()}
            >
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
