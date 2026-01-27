import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Button, Flex, Table, Heading, ConfirmDialog } from '@baby-toys/ui-kit';
import { Pencil, Trash2, Plus } from 'lucide-react';
import type { Material } from '../../api/types/material';
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
            leftIconComp={Pencil}
            appearance="outline"
            onClick={() => openEditDialog(row)}
            aria-label={`Edit ${row.name}`}
          />
          <Button
            size="small"
            appearance="outline"
            leftIconComp={Trash2}
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
            leftIconComp={Plus}
            onClick={() => {
              setDialogVisible(true);
            }}
          >
            Add Material
          </Button>
        </Flex>
        <Table
          stripedRows
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
