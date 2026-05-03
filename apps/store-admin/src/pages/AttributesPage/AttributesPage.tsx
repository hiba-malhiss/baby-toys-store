import React from 'react';
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
import { useDeleteAttributeType, useAttributeTypes } from '../../api/attributeApi';
import TypeUpsertDialog from './TypeUpsertDialog.tsx';
import type { AttributeTypeListDto as AttributeType } from '../../api/types/attribute';
import { Pencil, Trash2, ChevronDown, Plus } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import styles from './attributes.module.scss';
import AttributesValuesRow from './AttributesValuesRow.tsx';

const AttributesPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: types = [], isLoading: loadingTypes } = useAttributeTypes();
  const toast = useToast();
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});
  const [showAddType, setShowAddType] = React.useState(false);
  const [editRow, setEditRow] = React.useState<AttributeType | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<AttributeType | null>(null);
  const deleteType = useDeleteAttributeType();

  const handleDeleteType = async () => {
    if (!deleteRow) return;
    try {
      await deleteType.mutateAsync(deleteRow.id);
      toast.success(t('common.delete', { defaultValue: 'Deleted' }));
      setDeleteRow(null);
    } catch (e: any) {
      toast.error(e?.message || t('app.unexpectedError'));
    }
  };

  const toggleExpand = (id: string | number) => {
    setExpandedRows((prev) => ({ ...prev, [String(id)]: !prev[String(id)] }));
  };

  return (
    <AdminLayout>
      <PageHeader
        left={
          <Flex align="center" spacing="s">
            <Heading>{t('attributes.types', { defaultValue: 'Attributes' })}</Heading>
            <HelpTooltip
              title={t('attributes.helpTitle', { defaultValue: 'What are Attributes?' })}
              description={t('attributes.helpText', {
                defaultValue:
                  'Attributes describe fixed product properties like Material or Brand. Customers can filter by them. Unlike Options, they do not create variants.',
              })}
            />
          </Flex>
        }
        right={
          <Button leftIconComp={Plus} onClick={() => setShowAddType(true)}>
            {t('attributes.addType', { defaultValue: 'Add Attribute' })}
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
              header: t('attributes.displayEn', { defaultValue: 'Name' }),
              field: 'displayName',
              sortable: true,
              body: (row: AttributeType) => <span>{row.displayName ?? row.code ?? '—'}</span>,
            },
            {
              header: t('attributes.code', { defaultValue: 'Code' }),
              field: 'code',
              filter: true,
              sortable: true,
              body: (row: AttributeType) => (
                <code style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  {row.code}
                </code>
              ),
            },
            {
              header: t('attributes.flags', { defaultValue: 'Flags' }),
              field: 'flags',
              body: (row: AttributeType) => (
                <Flex spacing="xs">
                  {row.isFilterable && (
                    <Chip
                      appearance="secondary-outline"
                      size="small"
                      label={t('attributes.filterable', { defaultValue: 'Filterable' })}
                    />
                  )}
                  {row.isMultiselect && (
                    <Chip
                      appearance="secondary-outline"
                      size="small"
                      label={t('attributes.multi', { defaultValue: 'Multi' })}
                    />
                  )}
                  <Chip
                    appearance="secondary-outline"
                    size="small"
                    label={t('attributes.active', { defaultValue: 'Active' })}
                  />
                </Flex>
              ),
            },
            {
              header: t('attributes.values', { defaultValue: 'Values' }),
              field: 'values',
              body: (row: AttributeType) => {
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
              body: (row: AttributeType) => (
                <div className={styles.rowActions}>
                  <Tooltip position="top" content={t('common.edit', { defaultValue: 'Edit' })}>
                    <Button
                      appearance="outline"
                      size="small"
                      leftIconComp={Pencil}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditRow({ ...row });
                      }}
                      aria-label={t('common.edit')}
                    />
                  </Tooltip>
                  <Tooltip position="top" content={t('common.delete', { defaultValue: 'Delete' })}>
                    <Button
                      appearance="outline"
                      size="small"
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
          emptyMessage={t('attributes.noTypes', { defaultValue: 'No attributes' })}
          useLocalSortAndFilter
          rowHover
          expandedRows={expandedRows}
          onRowExpand={({ data }: { data: AttributeType }) =>
            setExpandedRows((p) => ({ ...p, [String(data.id)]: true }))
          }
          onRowCollapse={({ data }: { data: AttributeType }) =>
            setExpandedRows((p) => {
              const n = { ...p };
              delete n[String(data.id)];
              return n;
            })
          }
          rowExpansionTemplate={(row: AttributeType) => <AttributesValuesRow activeType={row} />}
        />
      )}

      <TypeUpsertDialog
        mode={editRow ? 'edit' : 'create'}
        visible={showAddType || !!editRow}
        typeId={editRow?.id}
        onClose={() => {
          setShowAddType(false);
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
        message={t('attributes.deleteConfirm', {
          defaultValue: 'Delete attribute "{{name}}"? This cannot be undone.',
          name: deleteRow?.displayName ?? deleteRow?.code,
        })}
        onConfirm={handleDeleteType}
        onCancel={() => setDeleteRow(null)}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
      />
    </AdminLayout>
  );
};

export default AttributesPage;
