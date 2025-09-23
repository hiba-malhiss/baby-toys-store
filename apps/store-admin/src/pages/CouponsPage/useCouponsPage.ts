import { useState, useCallback } from 'react';
import { useToast } from '@baby-toys/ui-kit';
import { Coupon } from '../../api/types/coupon';
import { useCoupons, useDeleteCoupon } from '../../api/couponApi';

export const useCouponsPage = () => {
  const toast = useToast();

  const [page, setPage] = useState(0); // API page (0-based)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('code');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
  // searchInput controls the text in the input; searchCode is the query param used for API
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchCode, setSearchCode] = useState<string>('');

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  const { data, isLoading } = useCoupons({
    page,
    size: rowsPerPage,
    sortBy: sortField,
    sortDirection,
    code: searchCode || undefined,
  });

  const coupons = data?.content ?? [];
  const totalItems = data?.totalElements ?? 0;

  const deleteCouponMutation = useDeleteCoupon();

  const handleDelete = async () => {
    if (!couponToDelete?.id) return false;
    try {
      await deleteCouponMutation.mutateAsync(couponToDelete.id);
      toast.success('Coupon deleted successfully');
      setConfirmDialogVisible(false);
      setCouponToDelete(null);
      return true;
    } catch {
      toast.error('Failed to delete coupon');
      return false;
    }
  };

  const openAddDialog = useCallback(() => {
    setEditingCoupon(null);
    setDialogVisible(true);
  }, []);

  const openEditDialog = useCallback((coupon: Coupon) => {
    setEditingCoupon(coupon);
    setDialogVisible(true);
  }, []);

  const openDeleteDialog = useCallback((coupon: Coupon) => {
    setCouponToDelete(coupon);
    setConfirmDialogVisible(true);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    // Table paginator is 1-based, API page is 0-based
    setPage(newPage - 1);
  }, []);

  const handleSort = useCallback((sortData: { field: string; order: number }) => {
    setSortField(sortData.field);
    setSortDirection(sortData.order === 1 ? 'ASC' : 'DESC');
    setPage(0); // Reset to the first page on sort change
  }, []);

  const handleSearch = useCallback((code: string) => {
    setSearchCode(code?.trim());
    setPage(0);
  }, []);

  return {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    handlePageChange,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    coupons,
    totalItems,
    isLoading,
    dialogVisible,
    setDialogVisible,
    editingCoupon,
    confirmDialogVisible,
    setConfirmDialogVisible,
    couponToDelete,
    handleDelete,
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    handleSort,
    handleSearch,
    searchInput,
    setSearchInput,
    searchCode,
  };
};

export default useCouponsPage;
