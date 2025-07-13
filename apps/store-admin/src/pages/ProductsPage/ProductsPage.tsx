import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { deleteProduct } from '@mock-data/useMockAdminApi';
import { Button, Flex, Table, Heading } from '@baby-toys/ui-kit/components';
import { useProductsTableColumns } from './useProductsTableColumns.tsx';
import { useNavigate } from 'react-router-dom';
import { useMockProductsApi } from '@mock-data/useMockProductsApi.ts';

const PAGE_SIZE = 8;

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = (id: string) => {
    deleteProduct(id).then(() => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTotalItems((prev) => prev - 1);
    });
  };

  const columns = useProductsTableColumns(handleDelete);

  const { fetchProducts } = useMockProductsApi(PAGE_SIZE);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const data = await fetchProducts(page, {
          sortBy: sortField ? `${sortField}:${sortOrder === 1 ? 'asc' : 'desc'}` : undefined,
          ...filters,
        });

        if (isMounted) {
          setProducts(data.items);
          setTotalItems(data.totalItems);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [page, sortField, sortOrder, filters, fetchProducts]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="xxl" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>Products</Heading>
          <Button onClick={() => navigate('/product-form/new')}>Add Product</Button>
        </Flex>
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
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </Flex>
    </AdminLayout>
  );
};

export default ProductsPage;
