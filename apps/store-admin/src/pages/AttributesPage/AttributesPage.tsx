import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useTranslation } from 'react-i18next';
import {Button,
  Flex,
  Heading,
  Table,
  BouncingDotsLoader,
  ConfirmDialog,
  Tooltip,
  useToast,
} from '@baby-toys/ui-kit';
import { useDeleteAttributeType, useAttributeTypes } from '../../api/attributeApi';
import AttributesValuesRow from './AttributesValuesRow';
import TypeUpsertDialog from './TypeUpsertDialog';
import type { AttributeTypeListDto as AttributeType } from '../../api/types/attribute';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ProductRelationshipDiagram from '../../components/ProductRelationshipDiagram';

const AttributesPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: types = [], isLoading: loadingTypes } = useAttributeTypes();
  const toast = useToast();
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});
  const [showAddType, setShowAddType] = React.useState(false);

  // Edit/Delete state
  const [editRow, setEditRow] = React.useState<AttributeType | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<AttributeType | null>(null);

  const deleteType = useDeleteAttributeType();

  const handleDeleteType = async () => {
    if (!deleteRow) return;
    try {
      await deleteType.mutateAsync(deleteRow.id);
      toast.success(t('common.delete', { defaultValue: 'Delete' }));
      setDeleteRow(null);
    } catch (e: any) {
      toast.error(e?.message || t('app.unexpectedError'));
    }
  };

  const handleRowExpand = ({ data }: { data: AttributeType }) => {
    setExpandedRows((prev) => ({ ...prev, [String(data.id)]: true }));
  };

  const handleRowCollapse = ({ data }: { data: AttributeType }) => {
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
          <Flex align="center">
            <Heading>{t('attributes.types', { defaultValue: 'Attributes' })}</Heading>
            <HelpTooltip
              title={t('attributes.helpTitle', { defaultValue: 'What are Attributes?' })}
              description={t('attributes.helpText', {
                defaultValue:
                  'Attributes describe fixed product properties like Material or Brand. Customers can filter by them. Unlike Options, they do not create variants.',
              })}
            />
          </Flex>
          <Flex spacing="m" align="center">
            <ProductRelationshipDiagram />
            <Button onClick={() => setShowAddType(true)}>
              {t('attributes.addType', { defaultValue: 'Add Attribute' })}
            </Button>
          </Flex>
        </Flex>

        {loadingTypes ? (
          <BouncingDotsLoader />
        ) : (
          <Table
            value={types}
            rows={types.length || 1}
            columns={[
              {
                header: t('attributes.code', { defaultValue: 'Code' }),
                field: 'code',
                filter: true,
                sortable: true,
              },
              {
                header: t('attributes.displayEn', { defaultValue: 'Display (EN)' }),
                field: 'displayName',
                sortable: false,
                body: (row: AttributeType) => row.displayName ?? '-',
              },
              {
                header: t('attributes.sortOrder', { defaultValue: 'Sort Order' }),
                field: 'sortOrder',
                sortable: true,
                body: (row: AttributeType) => row.sortOrder ?? 0,
              },
              {
                header: t('attributes.filterable', { defaultValue: 'Filterable' }),
                field: 'isFilterable',
                body: (row: AttributeType) => (row.isFilterable ? t('app.yes') : t('app.no')),
              },
              {
                header: t('attributes.multi', { defaultValue: 'Multi-select' }),
                field: 'isMultiselect',
                body: (row: AttributeType) => (row.isMultiselect ? t('app.yes') : t('app.no')),
              },
              {
                header: t('attributes.active', { defaultValue: 'Active' }),
                field: 'isActive',
                body: (row: AttributeType) => (row.isActive ? t('app.yes') : t('app.no')),
              },
              {
                header: t('app.actions', { defaultValue: 'Actions' }),
                field: 'actions',
                body: (row: AttributeType) => (
                  <Flex spacing="m">
                    <Tooltip
                      position="top"
                      content={t('options.manage', { defaultValue: 'Manage Values' })}
                    >
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
                    </Tooltip>
                    <Tooltip position="top" content={t('common.edit', { defaultValue: 'Edit' })}>
                      <Button
                        size="small"
                        appearance="outline"
                        leftIconComp={Pencil}
                        aria-label={t('common.edit', { defaultValue: 'Edit' })}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditRow({ ...row });
                        }}
                      />
                    </Tooltip>
                    <Tooltip
                      position="top"
                      content={t('common.delete', { defaultValue: 'Delete' })}
                    >
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
                    </Tooltip>
                  </Flex>
                ),
              },
            ]}
            paginator={false}
            stripedRows
            emptyMessage={t('attributes.noTypes', { defaultValue: 'No attributes' })}
            useLocalSortAndFilter
            rowHover
            expandedRows={expandedRows}
            onRowExpand={handleRowExpand as any}
            onRowCollapse={handleRowCollapse as any}
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
                defaultValue: editRow ? 'Update' : 'Create',
              })
            )
          }
        />

        <ConfirmDialog
          visible={!!deleteRow}
          header={t('common.confirmDeleteTitle', { defaultValue: 'Confirm Delete' })}
          message={t('categories.deleteConfirm', {
            defaultValue: 'Are you sure you want to delete “{{name}}”?',
            name: deleteRow?.code,
          })}
          onConfirm={handleDeleteType}
          onCancel={() => setDeleteRow(null)}
        />
      </Flex>
    </AdminLayout>
  );
};

export default AttributesPage;
