import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { getProductById, addProduct, updateProduct } from '@mock-data/useMockAdminApi.ts';
import { apiClient } from '../../api/apiClient';
import { StringInput, Button, Flex, TextArea } from '@baby-toys/ui-kit/components';

const ProductFormPage: React.FC = () => {
  const [product, setProduct] = useState<any>({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id !== 'new') {
      apiClient.get(getProductById, id).then(setProduct);
    }
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setProduct({ ...product, [field]: value });
  };

  const handleSubmit = () => {
    if (id === 'new') {
      apiClient.post(addProduct, product).then(() => navigate('/products'));
    } else {
      apiClient.put(updateProduct, product).then(() => navigate('/products'));
    }
  };

  return (
    <AdminLayout>
      <h1>{id === 'new' ? 'Add' : 'Edit'} Product</h1>
      <Flex direction="vertical" spacing="l">
        <StringInput
          label="Name"
          value={product.name || ''}
          onChange={(value) => handleChange('name', value)}
        />
        <TextArea
          label="Description"
          value={product.description || ''}
          onChange={(value) => handleChange('description', value)}
        />
        <StringInput
          label="Price"
          type="number"
          value={product.price || ''}
          onChange={(value) => handleChange('price', Number(value))}
        />
        <StringInput
          label="Stock"
          type="number"
          value={product.availableInStock || ''}
          onChange={(value) => handleChange('availableInStock', Number(value))}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </Flex>
    </AdminLayout>
  );
};

export default ProductFormPage;
