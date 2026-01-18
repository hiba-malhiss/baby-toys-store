import { useState } from 'react';
import { useToast } from '@baby-toys/ui-kit';
import { Brand } from '../../api/types/brand';
import { useBrands as useBrandsQuery, useDeleteBrand } from '../../api/brandApi';
import { useTranslation } from 'react-i18next';

export const useBrands = () => {
  const toast = useToast();
  const { t } = useTranslation();
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
      toast.success(t('brands.deleteSuccess'));
      setConfirmDialogVisible(false);
      setBrandToDelete(null);
      return true;
    } catch (error) {
      toast.error(t('brands.deleteError'));
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
