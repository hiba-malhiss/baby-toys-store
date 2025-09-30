import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../api/types/product';
import { useProducts, useDeleteProduct, useDeleteProducts } from '../../api/productApi';

export const useProductsPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const { data, isLoading } = useProducts({
    page: page - 1,
    size: rowsPerPage,
    sortBy: sortField,
    sortDirection: sortOrder.toUpperCase() as 'ASC' | 'DESC',
    query: searchQuery || undefined,
    onSale: onSaleOnly || undefined,
  });

  const products = data?.content ?? [];
  const totalItems = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const deleteMutation = useDeleteProduct();
  const deleteProducts = useDeleteProducts();

  const handleSort = ({ field, order }: { field: string; order: number }) => {
    setSortField(field);
    setSortOrder(order > 0 ? 'desc' : 'asc');
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setConfirmDialogVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    await deleteMutation.mutateAsync(productToDelete.id);
    setConfirmDialogVisible(false);
    setProductToDelete(null);
    setSelectedProducts([]);
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = () => {
    if (selectedProducts.length > 0) {
      deleteProducts.mutate(selectedProducts.map((p) => p.id));
      setSelectedProducts([]);
    }
    setShowBulkDeleteConfirm(false);
  };

  return {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    products,
    totalItems,
    totalPages,
    sortField,
    sortOrder,
    handleSort,
    searchQuery,
    handleSearch,
    onSaleOnly,
    setOnSaleOnly,
    selectedProducts,
    setSelectedProducts,
    productToDelete,
    confirmDialogVisible,
    setConfirmDialogVisible,
    handleDeleteClick,
    handleConfirmDelete,
    showBulkDeleteConfirm,
    handleBulkDelete,
    confirmBulkDelete,
    setShowBulkDeleteConfirm,
    navigateToCreate: () => navigate('/add-product'),
    isLoading,
    setSearchQuery,
  };
};
