import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Button,
  Flex,
  Table,
  Heading,
  ConfirmDialog,
  Alert,
  BouncingDotsLoader,
  Tooltip,
} from '@baby-toys/ui-kit';
import { Pencil, Trash2 } from 'lucide-react';
import { Category } from '../../api/types/category';
import useCategories from './useCategories';
import CategoryDialog from './CategoryDialog';
import { useTranslation } from 'react-i18next';

const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    categories,
    isLoading,
    error,
    dialogVisible,
    setDialogVisible,
    editingCategory,
    confirmDialogVisible,
    setConfirmDialogVisible,
    categoryToDelete,
    handleDelete,
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    handleSuccess,
  } = useCategories();

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
          title={t('categories.loadErrorTitle')}
          message={error.message || t('app.unexpectedError')}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" fullWidth>
          <Heading>{t('categories.title')}</Heading>
          <Button onClick={openAddDialog}>{t('categories.add')}</Button>
        </Flex>

        <Table
          stripedRows
          value={categories}
          columns={[
            { header: t('categories.columns.image'), field: 'imageUrl', type: 'image' },
            { header: t('categories.columns.name'), field: 'name' },
            { header: t('categories.columns.description'), field: 'description' },
            {
              header: t('app.actions'),
              field: 'actions',
              body: (category: Category) => (
                <Flex spacing="m">
                  <Tooltip position="top" content={t('common.edit')}>
                    <Button
                      size="small"
                      leftIconComp={Pencil}
                      appearance="outline"
                      onClick={() => openEditDialog(category)}
                    />
                  </Tooltip>
                  <Tooltip position="top" content={t('common.delete')}>
                    <Button
                      size="small"
                      appearance="outline"
                      leftIconComp={Trash2}
                      onClick={() => openDeleteDialog(category)}
                    />
                  </Tooltip>
                </Flex>
              ),
            },
          ]}
          emptyMessage={t('categories.empty')}
        />
      </Flex>

      <CategoryDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        onSuccess={handleSuccess}
        category={editingCategory}
      />

      <ConfirmDialog
        visible={confirmDialogVisible}
        onCancel={() => setConfirmDialogVisible(false)}
        onConfirm={handleDelete}
        header={t('common.confirmDeleteTitle')}
        message={t('categories.deleteConfirm', { name: categoryToDelete?.name })}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
      />
    </AdminLayout>
  );
};

export default CategoriesPage;
