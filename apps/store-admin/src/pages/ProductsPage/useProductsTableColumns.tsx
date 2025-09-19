import { Button, Flex, Chip, Rating } from '@baby-toys/ui-kit/components';
import { useNavigate } from 'react-router-dom';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useAdminStoreConfiguration } from '../../context/StoreConfigurationContext.tsx';
import { Product } from '@baby-toys/types/src';
import { formatProductReferences } from '../../utils/productUtils.ts';

export const useProductsTableColumns = (handleDelete: (product: Product) => void) => {
  const navigate = useNavigate();
  const { currency, brands, categories, colors, materials } = useAdminStoreConfiguration();

  const getFormattedReferences = (product: Product) => {
    return formatProductReferences(product, { brands, categories, colors, materials });
  };

  return [
    {
      field: 'mainImage',
      header: 'Image',
      body: (row: Product) => (
        <img
          src={row.mainImage}
          alt={row.name}
          style={{ width: 50, height: 50, objectFit: 'cover' }}
        />
      ),
    },
    {
      field: 'name',
      header: 'Name',
      sortable: true,
    },
    {
      field: 'brandId',
      header: 'Brand',
      sortable: true,
      body: (row: Product) => getFormattedReferences(row).brand,
    },
    {
      field: 'colorId',
      header: 'Colors',
      body: (row: Product) => getFormattedReferences(row).colors,
    },
    {
      field: 'materialIds',
      header: 'Materials',
      body: (row: Product) => getFormattedReferences(row).materials,
    },
    {
      field: 'category',
      header: 'Category',
      sortable: true,
      body: (row: Product) => getFormattedReferences(row).category,
    },
    {
      field: 'brand',
      header: 'Brand',
      body: (row: Product) => getFormattedReferences(row).brand,
    },
    {
      field: 'price',
      header: 'Price',
      sortable: true,
      body: (row: Product) => `${row.price} ${currency?.symbol || ''}`,
    },
    {
      field: 'availableInStock',
      header: 'Stock',
      sortable: true,
      body: (row: Product) => (
        <Chip
          label={row.availableInStock > 0 ? 'In Stock' : 'Out of Stock'}
          variant={row.availableInStock > 0 ? 'success' : 'danger'}
        />
      ),
    },
    {
      field: 'rating',
      header: 'Rating',
      body: (row: Product) => (
        <Flex spacing="xs">
          <Rating value={row.rating} /> <span>({row.numberOfRatings || 0})</span>
        </Flex>
      ),
    },
    {
      field: 'label',
      header: 'Label',
    },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: Product) => (
        <Flex spacing="m">
          <Button
            size="small"
            appearance="outline"
            leftIcon={faPen}
            onClick={() => navigate(`/edit-product/${row.id}`)}
          />
          <Button
            size="small"
            appearance="outline"
            leftIcon={faTrashAlt}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            variant="danger"
          />
        </Flex>
      ),
    },
  ];
};
