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
} from '@baby-toys/ui-kit/components';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Category } from '../../api/types/category';
import useCategories from './useCategories';
import CategoryDialog from './CategoryDialog';

const CategoriesPage: React.FC = () => {
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
          title="Failed to load categories"
          message={error.message || 'An unexpected error occurred.'}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" fullWidth>
          <Heading>Categories</Heading>
          <Button onClick={openAddDialog}>Add Category</Button>
        </Flex>

        <Table
          value={categories}
          columns={[
            { header: 'Image', field: 'imageUrl', type: 'image' },
            { header: 'Name', field: 'name' },
            { header: 'Description', field: 'description' },
            {
              header: 'Actions',
              field: 'actions',
              body: (category: Category) => (
                <Flex spacing="m">
                  <Button
                    size="small"
                    leftIcon={faPen}
                    appearance="outline"
                    onClick={() => openEditDialog(category)}
                  />
                  <Button
                    size="small"
                    appearance="outline"
                    leftIcon={faTrashAlt}
                    onClick={() => openDeleteDialog(category)}
                  />
                </Flex>
              ),
            },
          ]}
          emptyMessage="No categories found."
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
        header="Confirm Delete"
        message={`Are you sure you want to delete “${categoryToDelete?.name}”?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </AdminLayout>
  );
};

export default CategoriesPage;
