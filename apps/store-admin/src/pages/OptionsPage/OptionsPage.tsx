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
  Tooltip,
  FieldWrapper,
} from '@baby-toys/ui-kit';
import { useOptionTypes, useCreateOptionType } from '../../api/optionApi';
import type { OptionType } from '../../api/types/option';
import OptionsValuesRow from './OptionsValuesRow.tsx';

const OptionsPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: types = [], isLoading: loadingTypes } = useOptionTypes();
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});
  const [showAddType, setShowAddType] = React.useState(false);
  const [newTypeName, setNewTypeName] = React.useState('');

  const createType = useCreateOptionType();

  const handleCreateType = async () => {
    const name = newTypeName.trim();
    if (!name) return;

    await createType.mutateAsync({ name });
    setNewTypeName('');
    setShowAddType(false);
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
                  <Flex spacing="s">
                    <Button
                      size="small"
                      appearance="link"
                      color="highlighted"
                      onClick={() => {
                        const key = String(row.id);
                        setExpandedRows((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }));
                      }}
                    >
                      {t('options.manage', { defaultValue: 'Manage' })}
                    </Button>

                    <Tooltip
                      content={t('options.editDisabled', {
                        defaultValue: 'Edit endpoint not wired yet',
                      })}
                    >
                      <Button size="small" appearance="link" color="highlighted" isDisabled>
                        {t('app.edit', { defaultValue: 'Edit' })}
                      </Button>
                    </Tooltip>

                    <Tooltip
                      content={t('options.deleteDisabled', {
                        defaultValue: 'Delete endpoint not wired yet',
                      })}
                    >
                      <Button size="small" appearance="link" color="highlighted" isDisabled>
                        {t('app.delete', { defaultValue: 'Delete' })}
                      </Button>
                    </Tooltip>
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
      </Flex>
    </AdminLayout>
  );
};

export default OptionsPage;
