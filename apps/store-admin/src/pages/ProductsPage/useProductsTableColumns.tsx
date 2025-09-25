import { Button, Flex, Chip, Rating } from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import { faPen, faTrashAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../api/types/product.ts';
import currency from '../../config/currency';
import styles from './ProductsPage.module.scss';
import { CopyToClipboardButton } from '../../components/CopyToClipboardButton/CopyToClipboardButton';

export const useProductsTableColumns = (handleDelete: (product: Product) => void) => {
  const navigate = useNavigate();

  return [
    {
      field: 'id',
      header: 'ID',
      body: (row: Product) => (
        <Flex spacing="s" align="center">
          <span>#{row.id}</span>
          <CopyToClipboardButton
            value={row.id}
            successMessage="Product ID copied"
            ariaLabel="Copy product ID"
            appearance="link"
          />
        </Flex>
      ),
    },
    {
      field: 'mainImage',
      header: 'Image',
      type: 'image',
    },
    { field: 'name', header: 'Name', sortable: true },
    {
      field: 'brandName',
      header: 'Brand',
      sortable: true,
      body: (row: Product) => row.brandName || '-',
    },
    {
      field: 'categoryName',
      header: 'Category',
      sortable: true,
      body: (row: Product) => row.categoryName || '-',
    },
    {
      field: 'colorCodes',
      header: 'Colors',
      body: (row: Product) =>
        row.colorCodes && row.colorCodes.length > 0 ? (
          <div style={{ display: 'flex', gap: 4 }}>
            {row.colorCodes.map((code) => (
              <div
                key={code}
                className={styles.productsPageColorIndecator}
                style={{
                  backgroundColor: code,
                }}
                title={code}
              />
            ))}
          </div>
        ) : (
          '-'
        ),
    },
    {
      field: 'materialNames',
      header: 'Materials',
      body: (row: Product) => (row.materialNames?.length ? row.materialNames.join(', ') : '-'),
    },
    {
      field: 'price',
      header: 'Price',
      sortable: true,
      body: (row: Product) => `${currency.symbol}${row.price}`,
    },
    {
      field: 'stockQuantity',
      header: 'Stock',
      sortable: true,
      body: (row: Product) => (
        <Chip
          label={row.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
          variant={row.stockQuantity > 0 ? 'success' : 'danger'}
        />
      ),
    },
    {
      field: 'rating',
      header: 'Rating',
      body: (row: Product) =>
        row.rating ? (
          <Flex spacing="xs">
            <Rating value={row.rating} />
            <span>({row.numberOfRatings || 0})</span>
          </Flex>
        ) : (
          <span>-</span>
        ),
    },
    {
      field: 'releaseDate',
      header: 'Release Date',
      sortable: true,
      body: (row: Product) => row.releaseDate || '-',
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
            leftIcon={faStar}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/reviews?productId=${row.id}`);
            }}
          />
          <Button
            size="small"
            appearance="outline"
            leftIcon={faTrashAlt}
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          />
        </Flex>
      ),
    },
  ];
};
