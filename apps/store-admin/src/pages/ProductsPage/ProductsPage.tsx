import React from 'react';
import {
  Button,
  Flex,
  Table,
  Heading,
  ConfirmDialog,
  StringInput,
} from '@baby-toys/ui-kit';
import { faPlus, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useProductsTableColumns } from './useProductsTableColumns';
import { useProductsPage } from './useProductsPage';
import styles from './ProductsPage.module.scss';

const ProductsPage: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const {
    rowsPerPage,
    sortField,
    products,
    sortOrder,
    selectedProducts,
    productToDelete,
    confirmDialogVisible,
    showBulkDeleteConfirm,
    handleSort,
    handleSearch,
    handleDeleteClick,
    handleConfirmDelete,
    handleBulkDelete,
    confirmBulkDelete,
    setConfirmDialogVisible,
    setSelectedProducts,
    navigateToCreate,
    isLoading,
    setPage,
    setRowsPerPage,
    setShowBulkDeleteConfirm,
    totalItems,
  } = useProductsPage();

  const columns = useProductsTableColumns(handleDeleteClick);

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="xl" fullWidth>
        {/* Header */}
        <Flex justify="between" align="center" fullWidth>
          <Heading level="h1">Products</Heading>
          <Flex align="center" spacing="xl">
            <StringInput
              placeholder="Search products..."
              value={searchValue}
              className={styles.productsPagePageSearch}
              fullWidth
              onChange={(val) => {
                const v = String(val ?? '');
                setSearchValue(v);
                if (!v.length) handleSearch('');
              }}
              iconRight={faSearch}
              withIconBackground
              onIconClick={() => handleSearch(searchValue)}
            />
            <Button
              onClick={navigateToCreate}
              leftIcon={faPlus}
              color="primary"
              className={styles.productsPageAddButton}
            >
              Add Product
            </Button>
            <Button
              onClick={handleBulkDelete}
              leftIcon={faTrashAlt}
              color="secondary"
              className={styles.productsPageAddButton}
              isDisabled={!selectedProducts?.length}
            >
              Delete ({selectedProducts?.length})
            </Button>
          </Flex>
        </Flex>

        {/* Table */}
        <Table
          columns={columns}
          value={products}
          isLoading={isLoading}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
          selection={selectedProducts}
          onSelectionChange={setSelectedProducts}
          selectionMode="multiple"
          emptyMessage="No products found"
          bordered
          striped
          paginator
          rows={rowsPerPage}
          totalRecords={totalItems}
          onPageChange={(newPage: number, newSize: number) => {
            setPage(newPage);
            if (newSize !== rowsPerPage) setRowsPerPage(newSize);
          }}
        />

        {/* Delete confirmation */}
        <ConfirmDialog
          visible={confirmDialogVisible}
          header="Confirm Delete"
          message={
            productToDelete
              ? `Are you sure you want to delete "${productToDelete.name}"?`
              : `Are you sure you want to delete the selected product?`
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDialogVisible(false)}
        />

        <ConfirmDialog
          visible={showBulkDeleteConfirm}
          header="Confirm Delete"
          message={`Are you sure you want to delete ${selectedProducts.length} selected products?`}
          onConfirm={confirmBulkDelete}
          onCancel={() => setShowBulkDeleteConfirm(false)}
        />
      </Flex>
    </AdminLayout>
  );
};

export default ProductsPage;
