import { useState } from 'react';
import { useToast } from '@baby-toys/ui-kit';
import { Material } from '@baby-toys/types/src';
import { useMaterials as useMaterialsQuery, useDeleteMaterial } from '../../api/materialApi';

export const useMaterials = () => {
  const toast = useToast();
  const { data: materials = [], isLoading, error } = useMaterialsQuery();
  const deleteMutation = useDeleteMaterial();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);

  const handleDelete = async () => {
    if (!materialToDelete?.id) return false;

    try {
      await deleteMutation.mutateAsync(materialToDelete.id);
      toast.success('Material deleted successfully');
      setConfirmDialogVisible(false);
      setMaterialToDelete(null);
      return true;
    } catch (error) {
      toast.error('Failed to delete material');
      return false;
    }
  };

  const openEditDialog = (material: Material) => {
    setEditingMaterial(material);
    setDialogVisible(true);
  };

  const openDeleteDialog = (material: Material) => {
    setMaterialToDelete(material);
    setConfirmDialogVisible(true);
  };

  return {
    materials,
    isLoading,
    error,
    dialogVisible,
    setDialogVisible,
    editingMaterial,
    confirmDialogVisible,
    setConfirmDialogVisible,
    materialToDelete,
    handleDelete,
    openEditDialog,
    openDeleteDialog,
  };
};

export default useMaterials;
