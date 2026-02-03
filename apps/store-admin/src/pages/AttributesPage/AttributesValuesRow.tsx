import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Flex,
  StringInput,
  Table,
  BouncingDotsLoader,
  Tooltip,
  Dialog, FieldWrapper,
} from '@baby-toys/ui-kit';
import type { OptionType, OptionValue } from '../../api/types/option';
import { useOptionValues, useCreateOptionValue } from '../../api/optionApi';

type Props = {
  activeType: OptionType;
};

const AttributesValuesRow: React.FC<Props> = ({ activeType }) => {
  const { t } = useTranslation();
  const typeId = activeType.id;
  const { data: values = [], isLoading: loadingValues } = useOptionValues(typeId);
  const createValue = useCreateOptionValue(typeId);
  const [showAdd, setShowAdd] = React.useState(false);
  const [newValue, setNewValue] = React.useState('');
  const [newDisplay, setNewDisplay] = React.useState('');

  const closeAdd = () => {
    setShowAdd(false);
    setNewValue('');
    setNewDisplay('');
  };

  const handleCreateValue = async() => {
    const value = newValue.trim();
    if(!value) return;

    await createValue.mutateAsync({
      value,
      display: newDisplay.trim() || undefined,
    });

    closeAdd();
  };

  if(loadingValues) {
    return <BouncingDotsLoader/>
  }

  return (
    <>
      <Table
        value={values}
        rows={values.length || 1}
        title={<Flex justify="end" align="center" fullWidth>
          <Button appearance="outline" size="small" onClick={() => setShowAdd(true)}>
            {t('options.addValue', { defaultValue: 'Add Value' })}
          </Button>
        </Flex>}
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
              <Flex spacing="s">
                <Tooltip
                  content={t('options.editDisabled', {
                    defaultValue: 'Edit endpoint not wired yet',
                  })}
                >
                  <Button size="small" appearance="outline" isDisabled>
                    {t('app.edit', { defaultValue: 'Edit' })}
                  </Button>
                </Tooltip>

                <Tooltip
                  content={t('options.deleteDisabled', {
                    defaultValue: 'Delete endpoint not wired yet',
                  })}
                >
                  <Button size="small" appearance="outline" color="secondary" isDisabled>
                    {t('app.delete', { defaultValue: 'Delete' })}
                  </Button>
                </Tooltip>
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
            <FieldWrapper
              label="value"
              required
            >
              <StringInput
                placeholder={t('options.value', { defaultValue: 'Value' })}
                value={newValue}
                onChange={(v) => setNewValue(String(v ?? ''))}
              />
            </FieldWrapper>
            <FieldWrapper
              label="display"
            >
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
    </>
  );
};

export default AttributesValuesRow;
