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
} from '@baby-toys/ui-kit/components';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Color } from '../../api/types/color';
import useColorsPage from './useColors';
import ColorDialog from './ColorDialog';

const ColorsPage: React.FC = () => {
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
          title="Failed to load colors"
          message={error.message || 'An unexpected error occurred.'}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" fullWidth>
          <Heading>Colors</Heading>
          <Button onClick={openAddDialog}>Add Color</Button>
        </Flex>

        <Table
          columns={[
            {
              header: 'Name',
              field: 'name',
            },
            {
              header: 'Color',
              field: 'code',
              body: (row: Color) => (
                <Flex spacing="s" align="center">
                  <ColorPicker value={row.code} readOnly />
                  <span>{row.code}</span>
                </Flex>
              ),
            },
            {
              header: 'Actions',
              field: 'actions',
              body: (color: Color) => (
                <Flex spacing="m">
                  <Button
                    size="small"
                    leftIcon={faPen}
                    appearance="outline"
                    onClick={() => openEditDialog(color)}
                    aria-label="Edit"
                  />
                  <Button
                    size="small"
                    appearance="outline"
                    leftIcon={faTrashAlt}
                    onClick={() => openDeleteDialog(color)}
                    aria-label="Delete"
                  />
                </Flex>
              ),
            },
          ]}
          value={colors}
          emptyMessage="No colors found"
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
        header="Delete Color"
        message={`Are you sure you want to delete "${colorToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </AdminLayout>
  );
};

export default ColorsPage;
