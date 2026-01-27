import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Flex,
  Table,
  Heading,
  ConfirmDialog,
  StringInput,
  Select,
  Option,
} from '@baby-toys/ui-kit';
import { Plus, Search, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useProductsTableColumns } from './useProductsTableColumns';
import { useProductsPage } from './useProductsPage';
import styles from './ProductsPage.module.scss';

const ProductsPage: React.FC = () => {
  const qc = useQueryClient();
  const [searchValue, setSearchValue] = React.useState('');
  const {
    rowsPerPage,
    sortField,
    products,
    sortOrder,
    onSaleOnly,
    setOnSaleOnly,
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
            <Button
              onClick={() => qc.invalidateQueries({ queryKey: ['products'] })}
              color="secondary"
            >
              Refresh
            </Button>
            <Select
              value={onSaleOnly ? 'on' : 'all'}
              onChange={(v) => {
                const val = String(v);
                setOnSaleOnly(val === 'on');
                setPage(1);
              }}
            >
              <Option value="all">All</Option>
              <Option value="on">On sale</Option>
            </Select>
            <StringInput
              placeholder="Search products by name or id"
              value={searchValue}
              className={styles.productsPageSearch}
              fullWidth
              onChange={(val) => {
                const v = String(val ?? '');
                setSearchValue(v);
                if (!v.length) handleSearch('');
              }}
              iconRight={Search}
              withIconBackground
              onIconClick={() => handleSearch(searchValue)}
            />
            <Button
              onClick={navigateToCreate}
              leftIconComp={Plus}
              color="primary"
              className={styles.productsPageAddButton}
            >
              Add Product
            </Button>
            <Button
              onClick={handleBulkDelete}
              leftIconComp={Trash2}
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
          stripedRows
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
