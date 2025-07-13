import { Button, Flex } from '@baby-toys/ui-kit/components';
import { useNavigate } from 'react-router-dom';
import { faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useAdminStoreConfiguration } from '../../context/StoreConfigurationContext.tsx';

export const useProductsTableColumns = (handleDelete: (id: string) => void) => {
  const navigate = useNavigate();
  const { currency } = useAdminStoreConfiguration();

  return [
    {
      field: 'name',
      header: 'Name',
      sortable: true,
      filter: true,
    },
    {
      field: 'price',
      header: 'Price',
      sortable: true,
      body: (row: any) => `${row.price} ${currency?.symbol || ''}`,
    },
    {
      field: 'availableInStock',
      header: 'Stock',
    },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: any) => (
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
            onClick={() => handleDelete(row.id)}
            variant="danger"
          />
        </Flex>
      ),
    },
  ];
};
