import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  NoDataFound,
} from '@baby-toys/ui-kit';
import { Plus, Search, Trash2, FileUp } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useProductsTableColumns } from './useProductsTableColumns';
import { useProductsPage } from './useProductsPage';
import styles from './ProductsPage.module.scss';

const ProductsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const qc = useQueryClient();
  const navigate = useNavigate();
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
          <Heading level="h1">{t('products.title')}</Heading>
          <Flex align="center" spacing="xl">
            <Tooltip position="top" content={t('products.actions.refresh')}>
              <Button
                onClick={() => qc.invalidateQueries({ queryKey: ['products'] })}
                color="secondary"
                aria-label={t('products.actions.refresh')}
              >
                {t('products.actions.refresh')}
              </Button>
            </Tooltip>
            <Tooltip position="top" content="Import Products from Excel">
              <Button
                onClick={() => navigate('/products/import')}
                leftIconComp={FileUp}
                color="secondary"
                aria-label="Import Products"
              >
                Import Excel
              </Button>
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
                isDisabled={!selectedProducts?.length}
                aria-label={t('products.actions.deleteSelected', {
                  count: selectedProducts?.length || 0,
                })}
              >
                {t('products.actions.deleteSelected', { count: selectedProducts?.length })}
              </Button>
            </Tooltip>
          </Flex>
        </Flex>

        {/* Table or empty state */}
        {!isLoading && products.length === 0 && !searchValue ? (
          <NoDataFound
            message={t('products.actions.emptyTitle', { defaultValue: 'No Products Yet' })}
            subtext={t('products.actions.emptySubtext', {
              defaultValue:
                'Add your first product to start selling. You can set pricing, images, categories, attributes, and variants.',
            })}
            buttonText={t('products.actions.emptyButton', { defaultValue: 'Add First Product' })}
            onButtonClick={navigateToCreate}
          />
        ) : (
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
            striped
            paginator
            rows={rowsPerPage}
            totalRecords={totalItems}
            onPageChange={(newPage: number, newSize: number) => {
              setPage(newPage);
              if (newSize !== rowsPerPage) setRowsPerPage(newSize);
            }}
          />
        )}

        {/* Delete confirmation */}
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
          message={t('products.actions.confirmDelete.multiple', { count: selectedProducts.length })}
          onConfirm={confirmBulkDelete}
          onCancel={() => setShowBulkDeleteConfirm(false)}
        />
      </Flex>
    </AdminLayout>
  );
};

export default ProductsPage;
