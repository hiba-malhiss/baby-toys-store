import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useMockAdminApi } from '@mock-data/useMockApi';
import {
  Button,
  Flex,
  Table,
  Heading,
  ConfirmDialog,
  useToast,
  StringInput,
  Dialog,
  FieldWrapper,
  TextArea,
} from '@baby-toys/ui-kit/components';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Material } from '@baby-toys/types/src';

const MaterialsPage: React.FC = () => {
  const { getMaterials, addMaterial, deleteMaterial, updateMaterial } = useMockAdminApi();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const toast = useToast();

  const fetchMaterials = useCallback(async () => {
    const data = await getMaterials();
    setMaterials(data);
  }, [getMaterials]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const openAddDialog = () => {
    setEditingMaterial({ id: '', name: '', description: '' });
    setDialogVisible(true);
  };

  const openEditDialog = (material: Material) => {
    setEditingMaterial(material);
    setDialogVisible(true);
  };

  const handleSaveMaterial = async () => {
    try {
      if (editingMaterial?.id) {
        await updateMaterial(editingMaterial);
        toast.success('Material updated successfully');
      } else {
        await addMaterial({
          name: editingMaterial?.name || '',
          description: editingMaterial?.description || '',
        });
        toast.success('Material added successfully');
      }
      setDialogVisible(false);
      // Refetch materials to ensure we have the latest data
      await fetchMaterials();
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const openConfirmDialog = (material: Material) => {
    setMaterialToDelete(material);
    setConfirmDialogVisible(true);
  };

  const handleDelete = async () => {
    if (materialToDelete) {
      try {
        await deleteMaterial(materialToDelete.id);
        setConfirmDialogVisible(false);
        toast.success('Material deleted successfully');
        // Refetch materials to ensure we have the latest data
        await fetchMaterials();
      } catch (error) {
        toast.error(error.message || 'Failed to delete material');
      }
    }
  };

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
          />
          <Button
            size="small"
            appearance="outline"
            leftIcon={faTrashAlt}
            onClick={() => openConfirmDialog(row)}
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
          <Button onClick={openAddDialog}>Add Material</Button>
        </Flex>
        <Table value={materials} columns={columns} />
      </Flex>
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={editingMaterial?.id ? 'Edit Material' : 'Add Material'}
      >
        <Flex direction="vertical" spacing="m" align="end">
          <FieldWrapper label="Material name" fullWidth>
            <StringInput
              fullWidth
              value={editingMaterial?.name || ''}
              onChange={(v) => setEditingMaterial((prev: any) => ({ ...prev, name: v }))}
              placeholder="Material name"
            />
          </FieldWrapper>
          <FieldWrapper label="Description" fullWidth>
            <TextArea
              fullWidth
              value={editingMaterial?.description || ''}
              onChange={(v) => setEditingMaterial((prev: any) => ({ ...prev, description: v }))}
              placeholder="Add a description..."
            />
          </FieldWrapper>
          <Button onClick={handleSaveMaterial} isDisabled={!editingMaterial?.name}>
            {editingMaterial?.id ? 'Update' : 'Add'}
          </Button>
        </Flex>
      </Dialog>
      <ConfirmDialog
        visible={confirmDialogVisible}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialogVisible(false)}
        message={`Are you sure you want to delete "${materialToDelete?.name}" material?`}
        header="Confirmation"
        danger
      />
    </AdminLayout>
  );
};

export default MaterialsPage;
