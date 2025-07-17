import { Button, Flex, Chip, Rating } from '@baby-toys/ui-kit/components';
import { useNavigate } from 'react-router-dom';
import { faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useAdminStoreConfiguration } from '../../context/StoreConfigurationContext.tsx';
import { Product } from '@baby-toys/types/src';

export const useProductsTableColumns = (handleDelete: (product: Product) => void) => {
  const navigate = useNavigate();
  const { currency } = useAdminStoreConfiguration();

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
      field: 'category',
      header: 'Category',
      sortable: true,
    },
    {
      field: 'brand',
      header: 'Brand',
      body: (row: Product) => row.brand,
    },
    {
      field: 'price',
      header: 'Price',
      sortable: true,
      body: (row: Product) => `${row.price} ${currency?.symbol || ''}`,
    },
    {
      field: 'availableInStock',
      header: 'In Stock',
      sortable: true,
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
      field: 'status',
      header: 'Status',
      body: (row: Product) => (row.status ? <Chip label={row.status} /> : ''),
    },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: Product) => (
        <Flex spacing="m">
          <Button
            size="small"
            appearance="outline"
            leftIcon={faPencil}
            onClick={() => navigate(`/product-form/${row.id}`)}
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
