import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Button, Flex, Table, Heading, ConfirmDialog } from '@baby-toys/ui-kit/components';
import { useProductsTableColumns } from './useProductsTableColumns';
import { useNavigate } from 'react-router-dom';
import { useMockAdminApi } from '@mock-data/useMockApi';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@baby-toys/ui-kit/components';
import { Product } from '@baby-toys/types/src';

const PAGE_SIZE = 8;

const ProductsPage: React.FC = () => {
  const { getProducts, deleteProduct, deleteProducts } = useMockAdminApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProducts(page, PAGE_SIZE, {
        sortBy: sortField ? `${sortField}:${sortOrder === 1 ? 'asc' : 'desc'}` : undefined,
        ...filters,
      });
      setProducts(data.items);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products.');
    } finally {
      setIsLoading(false);
    }
  }, [page, sortField, sortOrder, filters, getProducts, toast]);

  useEffect(() => {
    fetchData();
  }, [page, sortField, sortOrder, filters]);

  const openConfirmDialog = (product?: Product) => {
    if (product) {
      setProductToDelete(product);
    } else {
      if (!selectedProducts.length) {
        toast.info('Please select at least one product to delete.');
        return;
      }
      setProductToDelete(null);
    }
    setConfirmDialogVisible(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setConfirmDialogVisible(false);
    try {
      if (productToDelete) {
        await deleteProduct(productToDelete.id);
        toast.success(`Product "${productToDelete.name}" deleted successfully`);
      } else {
        const ids = selectedProducts.map((p) => p.id);
        if (!ids.length) {
          toast.info('No products selected to delete.');
          return;
        }
        await deleteProducts(ids);
        toast.success(`${ids.length} product(s) deleted successfully`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product(s).');
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
      setSelectedProducts([]);
      fetchData();
    }
  };

  const columns = useProductsTableColumns(openConfirmDialog);

  const confirmMessage =
    productToDelete || selectedProducts.length === 1
      ? `Are you sure you want to delete "${productToDelete?.name || selectedProducts[0].name}"?`
      : `Are you sure you want to delete ${selectedProducts.length} product(s)?`;

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="xxl" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>Products</Heading>
          <Flex spacing="s">
            <Button
              leftIcon={faPlus}
              color="secondary-light"
              onClick={() => navigate('/product-form/new')}
            >
              Add Product
            </Button>
            <Button
              color="secondary-light"
              onClick={() => openConfirmDialog()}
              isDisabled={selectedProducts.length === 0}
              leftIcon={faTrashAlt}
            >
              Delete Selected
            </Button>
          </Flex>
        </Flex>

        <ConfirmDialog
          visible={confirmDialogVisible}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDialogVisible(false)}
          message={confirmMessage}
          header="Confirm Deletion"
          confirmLabel="Yes"
          cancelLabel="No"
          danger
        />

        <Table
          value={products}
          columns={columns}
          paginator
          rows={PAGE_SIZE}
          totalRecords={totalItems}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={({ field, order }) => {
            setSortField(field);
            setSortOrder(order);
            setPage(1);
          }}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
          }}
          onPageChange={(newPage) => setPage(newPage)}
          isLoading={isLoading || isDeleting}
          selectionMode="multiple"
          selection={selectedProducts}
          onSelectionChange={(newSelection) => {
            setSelectedProducts(newSelection || []);
          }}
          onRowClick={(e) => navigate(`/product-form/${e.data.id}`)}
        />
      </Flex>
    </AdminLayout>
  );
};

export default ProductsPage;
