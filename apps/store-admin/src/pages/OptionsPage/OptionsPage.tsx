import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Heading, Table, BouncingDotsLoader, ConfirmDialog } from '@baby-toys/ui-kit';
import { useOptionTypes, useDeleteOptionType } from '../../api/optionApi';
import type { OptionTypeDto as OptionType } from '../../api/types/option';
import OptionsValuesRow from './OptionsValuesRow.tsx';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@baby-toys/ui-kit';
import TypeUpsertDialog from './TypeUpsertDialog';

const OptionsPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: types = [], isLoading: loadingTypes } = useOptionTypes();
  const toast = useToast();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  // Edit/Delete state
  const [editRow, setEditRow] = useState<OptionType | null>(null);
  const [deleteRow, setDeleteRow] = useState<OptionType | null>(null);

  const deleteType = useDeleteOptionType();

  const openAdd = () => {
    setEditRow(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (row: OptionType) => {
    setEditRow(row);
    setDialogOpen(true);
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
          <Button onClick={openAdd}>
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
                header: t('options.typeCode', { defaultValue: 'Code' }),
                field: 'code',
                filter: true,
                sortable: true,
              },
              {
                header: t('options.displayName', { defaultValue: 'Display name' }),
                field: 'displayName',
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

        <TypeUpsertDialog
          visible={dialogOpen}
          mode={editRow ? 'edit' : 'create'}
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
            name: deleteRow?.code,
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
