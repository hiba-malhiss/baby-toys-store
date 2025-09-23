import { useState } from 'react';
import { useToast } from '@baby-toys/ui-kit';
import { Category } from '../../api/types/category';
import { useCategories as useCategoriesQuery, useDeleteCategory } from '../../api/categoryApi';

export const useCategories = () => {
  const toast = useToast();
  const { data: categories = [], isLoading, error } = useCategoriesQuery();
  const deleteCategoryMutation = useDeleteCategory();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleDelete = async () => {
    if (!categoryToDelete?.id) return false;

    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      toast.success('Category deleted successfully');
      setConfirmDialogVisible(false);
      setCategoryToDelete(null);
      return true;
    } catch (error) {
      toast.error('Failed to delete category');
      return false;
    }
  };

  const openAddDialog = () => {
    setEditingCategory(null);
    setDialogVisible(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setDialogVisible(true);
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setConfirmDialogVisible(true);
  };

  const handleSuccess = () => {
    setDialogVisible(false);
    setEditingCategory(null);
  };

  return {
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
  };
};

export default useCategories;
