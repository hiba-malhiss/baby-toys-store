import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Button,
  Flex,
  Table,
  Heading,
  ConfirmDialog,
  Alert,
  ColorPicker,
  BouncingDotsLoader,
} from '@baby-toys/ui-kit';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Color } from '../../api/types/color';
import useColorsPage from './useColors';
import ColorDialog from './ColorDialog';
import { useTranslation } from 'react-i18next';

const ColorsPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    colors,
    isLoading,
    error,
    dialogVisible,
    setDialogVisible,
    editingColor,
    confirmDialogVisible,
    setConfirmDialogVisible,
    colorToDelete,
    handleDelete,
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    handleSuccess,
  } = useColorsPage();

  if (isLoading) {
    return (
      <AdminLayout>
        <Flex justify="center">
          <BouncingDotsLoader />
        </Flex>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Alert
          appearance="error"
          title={t('colors.loadErrorTitle')}
          message={error.message || t('app.unexpectedError')}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" fullWidth>
          <Heading>{t('colors.title')}</Heading>
          <Button onClick={openAddDialog}>{t('colors.add')}</Button>
        </Flex>

        <Table
          stripedRows
          columns={[
            {
              header: t('colors.columns.name'),
              field: 'name',
            },
            {
              header: t('colors.columns.color'),
              field: 'code',
              body: (row: Color) => (
                <Flex spacing="s" align="center">
                  <ColorPicker value={row.code} readOnly />
                  <span>{row.code}</span>
                </Flex>
              ),
            },
            {
              header: t('app.actions'),
              field: 'actions',
              body: (color: Color) => (
                <Flex spacing="m">
                  <Button
                    size="small"
                    leftIcon={faPen}
                    appearance="outline"
                    onClick={() => openEditDialog(color)}
                    aria-label={t('common.edit')}
                  />
                  <Button
                    size="small"
                    appearance="outline"
                    leftIcon={faTrashAlt}
                    onClick={() => openDeleteDialog(color)}
                    aria-label={t('common.delete')}
                  />
                </Flex>
              ),
            },
          ]}
          value={colors}
          emptyMessage={t('colors.empty')}
        />
      </Flex>

      <ColorDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        onSuccess={handleSuccess}
        color={editingColor}
      />

      <ConfirmDialog
        visible={confirmDialogVisible}
        onCancel={() => setConfirmDialogVisible(false)}
        onConfirm={handleDelete}
        header={t('colors.deleteTitle')}
        message={t('colors.deleteConfirm', { name: colorToDelete?.name })}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
      />
    </AdminLayout>
  );
};

export default ColorsPage;
