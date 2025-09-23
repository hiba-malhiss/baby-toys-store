import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Button, Flex, Table, Heading, ConfirmDialog } from '@baby-toys/ui-kit';
import { faPen, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Material } from '@baby-toys/types/src';
import useMaterials from './useMaterials';
import MaterialDialog from './MaterialDialog';

const MaterialsPage: React.FC = () => {
  const {
    materials = [],
    isLoading,
    dialogVisible,
    setDialogVisible,
    editingMaterial,
    confirmDialogVisible,
    setConfirmDialogVisible,
    materialToDelete,
    handleDelete,
    openEditDialog,
    openDeleteDialog,
  } = useMaterials();

  const columns = [
    { field: 'name', header: 'Name' },
    {
      field: 'description',
      header: 'Description',
      body: (row: Material) => row.description || '-',
    },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: Material) => (
        <Flex spacing="m">
          <Button
            size="small"
            leftIcon={faPen}
            appearance="outline"
            onClick={() => openEditDialog(row)}
            aria-label={`Edit ${row.name}`}
          />
          <Button
            size="small"
            appearance="outline"
            leftIcon={faTrashAlt}
            onClick={() => openDeleteDialog(row)}
            aria-label={`Delete ${row.name}`}
          />
        </Flex>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" fullWidth>
          <Heading>Materials</Heading>
          <Button
            leftIcon={faPlus}
            onClick={() => {
              setDialogVisible(true);
            }}
          >
            Add Material
          </Button>
        </Flex>
        <Table
          value={materials}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No materials found"
        />
      </Flex>

      <MaterialDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        material={editingMaterial}
      />

      <ConfirmDialog
        visible={confirmDialogVisible}
        onCancel={() => setConfirmDialogVisible(false)}
        onConfirm={handleDelete}
        header="Delete Material"
        message={`Are you sure you want to delete "${materialToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      ></ConfirmDialog>
    </AdminLayout>
  );
};

export default MaterialsPage;
