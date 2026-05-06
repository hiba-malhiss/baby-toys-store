import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Heading,
  Table,
  BouncingDotsLoader,
  ConfirmDialog,
  Tooltip,
  useToast,
  Chip,
  Flex,
  PageHeader,
} from '@baby-toys/ui-kit';
import { useOptionTypes, useDeleteOptionType, useQueryClient } from '../../api/optionApi';
import type { OptionTypeDto as OptionType } from '../../api/types/option';
import { Pencil, Trash2, ChevronDown, Plus } from 'lucide-react';
import TypeUpsertDialog from './TypeUpsertDialog.tsx';
import HelpTooltip from '../../components/HelpTooltip';
import styles from './options.module.scss';
import OptionsValuesRow from './OptionsValuesRow.tsx';

const OptionsPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: types = [], isLoading: loadingTypes, refetch: refetchTypes } = useOptionTypes();
  const toast = useToast();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
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
  const toggleExpand = (id: string | number) =>
    setExpandedRows((p) => ({ ...p, [String(id)]: !p[String(id)] }));

  const handleDeleteOption = async () => {
    if (!deleteRow) return;
    try {
      await deleteType.mutateAsync(deleteRow.id);
      toast.success(t('common.delete', { defaultValue: 'Deleted' }));
      setDeleteRow(null);
    } catch (e: any) {
      toast.error(e?.message || t('app.unexpectedError'));
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        left={
          <Flex align="center" spacing="s">
            <Heading>{t('options.types', { defaultValue: 'Options' })}</Heading>
            <HelpTooltip
              title={t('options.helpTitle', { defaultValue: 'What are Options?' })}
              description={t('options.helpText', {
                defaultValue:
                  'Options create purchasable variants like Size or Color. Each type has values (S, M, L), and combinations generate unique variants with their own price and stock.',
              })}
            />
          </Flex>
        }
        right={
          <Button leftIconComp={Plus} onClick={openAdd}>
            {t('options.addType', { defaultValue: 'Add Option Type' })}
          </Button>
        }
      />

      {loadingTypes ? (
        <BouncingDotsLoader />
      ) : (
        <Table
          value={types}
          rows={types.length || 1}
          stripedRows
          columns={[
            {
              header: t('options.displayName', { defaultValue: 'Name' }),
              field: 'displayName',
              sortable: true,
              body: (row: OptionType) => (
                <span>
                  {row.displayName || row.translations?.[0]?.displayName || row.code || '—'}
                </span>
              ),
            },
            {
              header: t('options.code', { defaultValue: 'Code' }),
              field: 'code',
              filter: true,
              sortable: true,
              body: (row: OptionType) => (
                <code style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  {row.code}
                </code>
              ),
            },
            {
              header: t('options.flags', { defaultValue: 'Flags' }),
              field: 'isFilterable',
              body: (row: OptionType) => (
                <Chip
                  appearance="secondary-outline"
                  size="small"
                  label={t('options.isFilterable', { defaultValue: 'Filterable' })}
                />
              ),
            },
            {
              header: t('attributes.values', { defaultValue: 'Values' }),
              field: 'values',
              body: (row: OptionType) => {
                const isOpen = !!expandedRows[String(row.id)];
                return (
                  <Button
                    appearance="link"
                    size="xsmall"
                    isSelected={isOpen}
                    leftIconComp={ChevronDown}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(row.id);
                    }}
                  >
                    Values
                  </Button>
                );
              },
            },
            {
              header: '',
              field: 'actions',
              body: (row: OptionType) => (
                <div className={styles.rowActions}>
                  <Tooltip position="top" content={t('common.edit', { defaultValue: 'Edit' })}>
                    <Button
                      size="small"
                      appearance="outline"
                      leftIconComp={Pencil}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(row);
                      }}
                      aria-label={t('common.edit')}
                    />
                  </Tooltip>
                  <Tooltip position="top" content={t('common.delete', { defaultValue: 'Delete' })}>
                    <Button
                      size="small"
                      appearance="outline"
                      color="error"
                      leftIconComp={Trash2}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteRow(row);
                      }}
                      aria-label={t('common.delete')}
                    />
                  </Tooltip>
                </div>
              ),
            },
          ]}
          paginator={false}
          emptyMessage={t('options.noTypes', { defaultValue: 'No option types' })}
          useLocalSortAndFilter
          rowHover
          expandedRows={expandedRows}
          onRowExpand={({ data }: { data: OptionType }) =>
            setExpandedRows((p) => ({ ...p, [String(data.id)]: true }))
          }
          onRowCollapse={({ data }: { data: OptionType }) =>
            setExpandedRows((p) => {
              const n = { ...p };
              delete n[String(data.id)];
              return n;
            })
          }
          rowExpansionTemplate={(row: OptionType) => <OptionsValuesRow activeType={row} />}
        />
      )}

      <TypeUpsertDialog
        visible={dialogOpen}
        mode={editRow ? 'edit' : 'create'}
        initial={editRow as any}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          toast.success(
            t(editRow ? 'common.update' : 'common.create', {
              defaultValue: editRow ? 'Updated' : 'Created',
            })
          );
          refetchTypes();
        }}
      />

      <ConfirmDialog
        visible={!!deleteRow}
        header={t('common.confirmDeleteTitle', { defaultValue: 'Confirm Delete' })}
        message={t('options.deleteConfirm', {
          defaultValue: 'Delete option "{{name}}"? This cannot be undone.',
          name: deleteRow?.displayName ?? deleteRow?.code,
        })}
        onConfirm={handleDeleteOption}
        onCancel={() => setDeleteRow(null)}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
      />
    </AdminLayout>
  );
};

export default OptionsPage;
