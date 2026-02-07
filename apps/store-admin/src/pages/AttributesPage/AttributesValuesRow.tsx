import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Table, BouncingDotsLoader, ConfirmDialog } from '@baby-toys/ui-kit';
import type {
  AttributeTypeListDto as AttributeType,
  AttributeValueAdminDto as AttributeValue,
} from '../../api/types/attribute';
import { Pencil, Trash2 } from 'lucide-react';
import { useAttributeTypeAdmin, useDeleteAttributeValue } from '../../api/attributeApi';
import { useToast } from '@baby-toys/ui-kit';
import ValueUpsertDialog from './ValueUpsertDialog';

type Props = {
  activeType: AttributeType;
};

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

  const closeAdd = () => setShowAdd(false);

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
              {t('attributes.addValue', { defaultValue: 'Add Value' })}
            </Button>
          </Flex>
        }
        columns={[
          {
            header: t('attributes.code', { defaultValue: 'Code' }),
            field: 'code',
            filter: true,
            sortable: true,
          },
          {
            header: t('attributes.displayEn', { defaultValue: 'Display (EN)' }),
            field: 'displayEn',
            filter: true,
            sortable: false,
            body: (row: AttributeValue) => {
              const tr = row.translations || [];
              const en = tr.find((x: any) => (x?.locale || '').toLowerCase() === 'en');
              return en?.displayValue ?? row.display ?? '-';
            },
          },
          {
            header: t('attributes.displayAr', { defaultValue: 'Display (AR)' }),
            field: 'displayAr',
            filter: true,
            sortable: false,
            body: (row: AttributeValue) => {
              const tr = row.translations || [];
              const ar = tr.find((x: any) => (x?.locale || '').toLowerCase() === 'ar');
              return ar?.displayValue ?? '-';
            },
          },
          {
            header: t('attributes.sortOrder', { defaultValue: 'Sort Order' }),
            field: 'sortOrder',
            sortable: true,
            body: (row: AttributeValue) => row.sortOrder ?? 0,
          },
          {
            header: t('attributes.active', { defaultValue: 'Active' }),
            field: 'isActive',
            sortable: false,
            body: (row: AttributeValue) => (row.isActive ? t('app.yes') : t('app.no')),
          },
          {
            header: t('app.actions', { defaultValue: 'Actions' }),
            field: 'actions',
            body: (row: AttributeValue) => (
              <Flex spacing="m">
                <Button
                  size="small"
                  appearance="outline"
                  leftIconComp={Pencil}
                  aria-label={t('common.edit', { defaultValue: 'Edit' })}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditValue({ ...row });
                  }}
                />
                <Button
                  size="small"
                  appearance="outline"
                  leftIconComp={Trash2}
                  aria-label={t('common.delete', { defaultValue: 'Delete' })}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteValue(row);
                  }}
                />
              </Flex>
            ),
          },
        ]}
        paginator={false}
        stripedRows
        emptyMessage={t('attributes.noValues', { defaultValue: 'No values' })}
        useLocalSortAndFilter
        rowHover
      />

      <ValueUpsertDialog
        mode={editValue ? 'edit' : 'create'}
        visible={showAdd || !!editValue}
        onClose={() => {
          closeAdd();
          setEditValue(null);
        }}
        typeId={typeId}
        initial={editValue as any}
        onSuccess={() =>
          toast.success(
            t(editValue ? 'common.update' : 'common.create', {
              defaultValue: editValue ? 'Update' : 'Create',
            })
          )
        }
      />

      <ConfirmDialog
        visible={!!deleteValue}
        header="Confirm Delete"
        message={t('common.delete', { defaultValue: 'Delete' })}
        onConfirm={async () => {
          if (!deleteValue) return;
          try {
            await deleteValueHook.mutateAsync(deleteValue.id);
            toast.success(t('common.delete', { defaultValue: 'Delete' }));
            setDeleteValue(null);
          } catch (e: any) {
            toast.error(e?.message || t('app.unexpectedError'));
          }
        }}
        onCancel={() => setDeleteValue(null)}
      />
    </>
  );
};

export default AttributesValuesRow;
