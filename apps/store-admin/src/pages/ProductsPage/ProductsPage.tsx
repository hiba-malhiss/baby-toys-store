import React from 'react';
import { useTranslation } from 'react-i18next';
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
  Tooltip,
  PageHeader,
} from '@baby-toys/ui-kit';
import { Plus, Search, Trash2, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useProductsTableColumns } from './useProductsTableColumns';
import { useProductsPage } from './useProductsPage';
import styles from './ProductsPage.module.scss';

const ProductsPage: React.FC = () => {
  const { t } = useTranslation('common');
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
      <Flex direction="vertical" spacing="m" fullWidth>
        <PageHeader
          left={<Heading level="h1">{t('products.title')}</Heading>}
          right={
            <Flex align="center" spacing="s">
              <Tooltip position="top" content={t('products.actions.refresh')}>
                <Button
                  onClick={() => qc.invalidateQueries({ queryKey: ['products'] })}
                  appearance="outline"
                  leftIconComp={RefreshCw}
                  aria-label={t('products.actions.refresh')}
                />
              </Tooltip>
              <Select
                value={onSaleOnly ? 'on' : 'all'}
                onChange={(v) => {
                  const val = String(v);
                  setOnSaleOnly(val === 'on');
                  setPage(1);
                }}
              >
                <Option value="all">{t('products.filters.all')}</Option>
                <Option value="on">{t('products.filters.onSale')}</Option>
              </Select>
              <StringInput
                placeholder={t('products.searchPlaceholder')}
                value={searchValue}
                className={styles.productsPageSearch}
                onChange={(val) => {
                  const v = String(val ?? '');
                  setSearchValue(v);
                  if (!v.length) handleSearch('');
                }}
                iconRight={Search}
                withIconBackground
                onIconClick={() => handleSearch(searchValue)}
              />
              <Tooltip position="top" content={t('products.actions.addProduct')}>
                <Button
                  onClick={navigateToCreate}
                  leftIconComp={Plus}
                  color="primary"
                  className={styles.productsPageAddButton}
                  aria-label={t('products.actions.addProduct')}
                >
                  {t('products.actions.addProduct')}
                </Button>
              </Tooltip>
              {selectedProducts?.length > 0 && (
                <Tooltip
                  position="top"
                  content={t('products.actions.deleteSelected', {
                    count: selectedProducts?.length || 0,
                  })}
                >
                  <Button
                    onClick={handleBulkDelete}
                    leftIconComp={Trash2}
                    color="secondary"
                    className={styles.productsPageAddButton}
                    aria-label={t('products.actions.deleteSelected', {
                      count: selectedProducts?.length || 0,
                    })}
                  >
                    {t('products.actions.deleteSelected', { count: selectedProducts?.length })}
                  </Button>
                </Tooltip>
              )}
            </Flex>
          }
        />

        {/* Table or empty state */}

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
          emptyMessage={t('products.actions.noProducts')}
          bordered
          paginator
          rows={rowsPerPage}
          totalRecords={totalItems}
          onPageChange={(newPage: number, newSize: number) => {
            setPage(newPage);
            if (newSize !== rowsPerPage) setRowsPerPage(newSize);
          }}
        />
        {/* Delete confirmations */}
        <ConfirmDialog
          visible={confirmDialogVisible}
          header={t('products.actions.confirmDelete.header')}
          message={
            productToDelete
              ? t('products.actions.confirmDelete.single', { name: productToDelete.name })
              : t('products.actions.confirmDelete.single', {
                  name: t('products.actions.selectedProduct'),
                })
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDialogVisible(false)}
        />

        <ConfirmDialog
          visible={showBulkDeleteConfirm}
          header={t('products.actions.confirmDelete.header')}
          message={t('products.actions.confirmDelete.multiple', {
            count: selectedProducts.length,
          })}
          onConfirm={confirmBulkDelete}
          onCancel={() => setShowBulkDeleteConfirm(false)}
        />
      </Flex>
    </AdminLayout>
  );
};

export default ProductsPage;
