import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { getProducts, deleteProduct } from '../../api/useMockAdminApi';
import { apiClient } from '../../api/apiClient';
import { Button, Flex, StringInput, Card, Paginator } from '@baby-toys/ui-kit/components';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get(getProducts, page, 10, { search }).then((data) => {
      setProducts(data.items);
      setTotalPages(data.totalPages);
    });
  }, [search, page]);

  const handleDelete = (id: string) => {
    apiClient.delete(deleteProduct, id).then(() => {
      apiClient.get(getProducts, page, 10, { search }).then((data) => {
        setProducts(data.items);
        setTotalPages(data.totalPages);
      });
    });
  };

  return (
    <AdminLayout>
      <Flex justify="between" align="center">
        <h1>Products</h1>
        <Button onClick={() => navigate('/product-form/new')}>Add Product</Button>
      </Flex>
      <StringInput
        placeholder="Search products..."
        value={search}
        onChange={(value) => setSearch(value as string)}
      />
      <Card>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.availableInStock}</td>
                <td>
                  <Button onClick={() => navigate(`/product-form/${product.id}`)}>Edit</Button>
                  <Button onClick={() => handleDelete(product.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Paginator
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Card>
    </AdminLayout>
  );
};

export default ProductsPage;
