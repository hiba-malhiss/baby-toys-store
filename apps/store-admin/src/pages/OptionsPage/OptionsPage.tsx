import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Flex,
  Heading,
  Table,
  BouncingDotsLoader,
  Dialog,
  StringInput,
  FieldWrapper,
  ConfirmDialog,
} from '@baby-toys/ui-kit';
import { useOptionTypes, useCreateOptionType, useUpdateOptionType, useDeleteOptionType } from '../../api/optionApi';
import type { OptionType } from '../../api/types/option';
import OptionsValuesRow from './OptionsValuesRow.tsx';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@baby-toys/ui-kit';

const OptionsPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: types = [], isLoading: loadingTypes } = useOptionTypes();
  const toast = useToast();
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});
  const [showAddType, setShowAddType] = React.useState(false);
  const [newTypeName, setNewTypeName] = React.useState('');

  // Edit/Delete state
  const [editRow, setEditRow] = React.useState<OptionType | null>(null);
  const [editName, setEditName] = React.useState('');
  const [deleteRow, setDeleteRow] = React.useState<OptionType | null>(null);

  const createType = useCreateOptionType();
  const deleteType = useDeleteOptionType();

  const handleCreateType = async () => {
    const name = newTypeName.trim();
    if (!name) return;

    try {
      await createType.mutateAsync({ name });
      toast.success(t('common.create', { defaultValue: 'Create' }));
      setNewTypeName('');
      setShowAddType(false);
    } catch (e: any) {
      toast.error(e?.message || t('app.unexpectedError'));
    }
  };

  const handleOpenEdit = (row: OptionType) => {
    setEditRow(row);
    setEditName(row.name || '');
  };

  const handleSaveEdit = async () => {
    if (!editRow) return;
    const name = editName.trim();
    if (!name) return;
    const updateType = useUpdateOptionType(editRow.id);
    try {
      await updateType.mutateAsync({ name });
      toast.success(t('common.update', { defaultValue: 'Update' }));
      setEditRow(null);
      setEditName('');
    } catch (e: any) {
      toast.error(e?.message || t('app.unexpectedError'));
    }
  };

  const handleRowExpand = ({ data }: { data: OptionType }) => {
    setExpandedRows((prev) => ({ ...prev, [String(data.id)]: true }));
  };

  const handleRowCollapse = ({ data }: { data: OptionType }) => {
    setExpandedRows((prev) => {
      const next = { ...prev };
      delete next[String(data.id)];
      return next;
    });
  };

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="xl" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>{t('options.types', { defaultValue: 'Option Types' })}</Heading>
          <Button onClick={() => setShowAddType(true)}>
            {t('options.addType', { defaultValue: 'Add Option Type' })}
          </Button>
        </Flex>

        {loadingTypes ? (
          <BouncingDotsLoader />
        ) : (
          <Table
            value={types}
            rows={types.length || 1}
            columns={[
              {
                header: t('options.typeName', { defaultValue: 'Name' }),
                field: 'name',
                filter: true,
                sortable: true,
              },
              {
                header: t('app.actions', { defaultValue: 'Actions' }),
                field: 'actions',
                body: (row: OptionType) => (
                  <Flex spacing="m">
                    <Button
                      size="small"
                      appearance="outline"
                      leftIconComp={Eye}
                      aria-label={t('options.manage', { defaultValue: 'Manage Values' })}
                      onClick={(e) => {
                        e.stopPropagation();
                        const key = String(row.id);
                        setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
                      }}
                    />
                    <Button
                      size="small"
                      appearance="outline"
                      leftIconComp={Pencil}
                      aria-label={t('common.edit', { defaultValue: 'Edit' })}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(row);
                      }}
                    />
                    <Button
                      size="small"
                      appearance="outline"
                      leftIconComp={Trash2}
                      aria-label={t('common.delete', { defaultValue: 'Delete' })}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteRow(row);
                      }}
                    />
                  </Flex>
                ),
              },
            ]}
            paginator={false}
            stripedRows
            emptyMessage={t('options.noTypes', { defaultValue: 'No option types' })}
            useLocalSortAndFilter
            rowHover
            expandedRows={expandedRows}
            onRowExpand={handleRowExpand as any}
            onRowCollapse={handleRowCollapse as any}
            rowExpansionTemplate={(row: OptionType) => <OptionsValuesRow activeType={row} />}
          />
        )}

        <Dialog
          header={t('options.addType', { defaultValue: 'Add Option Type' })}
          visible={showAddType}
          onVisibleChange={setShowAddType as any}
          dismissibleMask
          modal
        >
          <Flex direction="vertical" spacing="m">
            <FieldWrapper label="Option name" required>
              <StringInput
                placeholder={t('options.typeName', { defaultValue: 'Name' })}
                value={newTypeName}
                onChange={(v) => setNewTypeName(String(v ?? ''))}
              />
            </FieldWrapper>
            <Flex justify="end" spacing="s">
              <Button appearance="outline" onClick={() => setShowAddType(false)}>
                {t('app.cancel', { defaultValue: 'Cancel' })}
              </Button>
              <Button
                onClick={handleCreateType}
                isLoading={createType.isPending}
                isDisabled={!newTypeName.trim()}
              >
                {t('app.save', { defaultValue: 'Save' })}
              </Button>
            </Flex>
          </Flex>
        </Dialog>

        {/* Edit type dialog */}
        <Dialog
          header={t('common.edit', { defaultValue: 'Edit' })}
          visible={!!editRow}
          onVisibleChange={(vis: boolean) => !vis && setEditRow(null)}
          dismissibleMask
          modal
        >
          <Flex direction="vertical" spacing="m">
            <FieldWrapper label="Option name" required>
              <StringInput
                placeholder={t('options.typeName', { defaultValue: 'Name' })}
                value={editName}
                onChange={(v) => setEditName(String(v ?? ''))}
              />
            </FieldWrapper>
            <Flex justify="end" spacing="s">
              <Button appearance="outline" onClick={() => setEditRow(null)}>
                {t('app.cancel', { defaultValue: 'Cancel' })}
              </Button>
              <Button onClick={handleSaveEdit} isDisabled={!editName.trim()}>
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
            name: deleteRow?.name,
          })}
          onConfirm={async () => {
            if (!deleteRow) return;
            try {
              await deleteType.mutateAsync(deleteRow.id);
              toast.success(t('common.delete', { defaultValue: 'Delete' }));
              setDeleteRow(null);
            } catch (e: any) {
              toast.error(e?.message || t('app.unexpectedError'));
            }
          }}
          onCancel={() => setDeleteRow(null)}
        />
      </Flex>
    </AdminLayout>
  );
};

export default OptionsPage;
