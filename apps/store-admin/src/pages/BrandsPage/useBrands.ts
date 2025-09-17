import { useState } from 'react';
import { useToast } from '@baby-toys/ui-kit/components';
import { Brand } from '../../api/types/brand';
import { useBrands as useBrandsQuery, useDeleteBrand } from '../../api/brandApi';

export const useBrands = () => {
  const toast = useToast();
  const { data: brands = [], isLoading, error } = useBrandsQuery();
  const deleteBrandMutation = useDeleteBrand();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  const handleDelete = async () => {
    if (!brandToDelete?.id) return false;

    try {
      await deleteBrandMutation.mutateAsync(brandToDelete.id);
      toast.success('Brand deleted successfully');
      setConfirmDialogVisible(false);
      setBrandToDelete(null);
      return true;
    } catch (error) {
      toast.error('Failed to delete brand');
      return false;
    }
  };

  const openAddDialog = () => {
    setEditingBrand(null);
    setDialogVisible(true);
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    setDialogVisible(true);
  };

  const openDeleteDialog = (brand: Brand) => {
    setBrandToDelete(brand);
    setConfirmDialogVisible(true);
  };

  const handleSuccess = () => {
    setDialogVisible(false);
    setEditingBrand(null);
  };

  return {
    brands,
    isLoading,
    error,
    dialogVisible,
    setDialogVisible,
    editingBrand,
    confirmDialogVisible,
    setConfirmDialogVisible,
    brandToDelete,
    handleDelete,
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    handleSuccess,
  };
};

export default useBrands;
