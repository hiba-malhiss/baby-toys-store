import { useState } from 'react';
import { useToast } from '@baby-toys/ui-kit';
import { Color } from '../../api/types/color';
import { useColors, useDeleteColor } from '../../api/colorApi';

export const useColorsPage = () => {
  const toast = useToast();
  const { data: colors = [], isLoading, error } = useColors();
  const deleteColorMutation = useDeleteColor();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);

  const handleDelete = async () => {
    if (!colorToDelete?.id) return false;

    try {
      await deleteColorMutation.mutateAsync(colorToDelete.id);
      toast.success('Color deleted successfully');
      setConfirmDialogVisible(false);
      setColorToDelete(null);
      return true;
    } catch (error) {
      toast.error('Failed to delete color');
      return false;
    }
  };

  const openAddDialog = () => {
    setEditingColor(null);
    setDialogVisible(true);
  };

  const openEditDialog = (color: Color) => {
    setEditingColor(color);
    setDialogVisible(true);
  };

  const openDeleteDialog = (color: Color) => {
    setColorToDelete(color);
    setConfirmDialogVisible(true);
  };

  const handleSuccess = () => {
    setDialogVisible(false);
    setEditingColor(null);
  };

  return {
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
  };
};

export default useColorsPage;
