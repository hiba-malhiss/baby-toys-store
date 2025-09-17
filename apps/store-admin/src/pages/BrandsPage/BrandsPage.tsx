import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Button,
  Flex,
  Table,
  Heading,
  ConfirmDialog,
  Alert,
  BouncingDotsLoader,
} from '@baby-toys/ui-kit/components';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import useBrands from './useBrands';
import BrandDialog from './BrandDialog';
import { Brand } from '../../api/types/brand.ts';

const BrandsPage: React.FC = () => {
  const {
    brands,
    isLoading,
    error,
    dialogVisible,
    setDialogVisible,
    editingBrand,
    confirmDialogVisible,
    setConfirmDialogVisible,
    brandToDelete,
    handleDelete,
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    handleSuccess,
  } = useBrands();

  if (isLoading) {
    return (
      <AdminLayout>
        <Flex justify="center" className="py-10">
          <BouncingDotsLoader />
        </Flex>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Alert
          appearance="error"
          title="Failed to load brands"
          message={error.message || 'An unexpected error occurred.'}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" fullWidth>
          <Heading>Brands</Heading>
          <Button onClick={openAddDialog}>Add Brand</Button>
        </Flex>

        <Table
          columns={[
            {
              header: 'Logo',
              field: 'logoUrl',
              body: (row) =>
                row.logoUrl ? (
                  <img src={row.logoUrl} alt={row.name} className="h-10 w-10 object-contain" />
                ) : (
                  <div className="h-10 w-10 bg-gray-100 flex items-center justify-center text-gray-400">
                    No Logo
                  </div>
                ),
            },
            {
              header: 'Name',
              field: 'name',
            },
            {
              header: 'Description',
              field: 'description',
            },
            {
              header: 'Actions',
              field: 'actions',
              body: (brand: Brand) => (
                <Flex spacing="m">
                  <Button
                    size="small"
                    leftIcon={faPen}
                    appearance="outline"
                    onClick={() => openEditDialog(brand)}
                  />
                  <Button
                    size="small"
                    appearance="outline"
                    leftIcon={faTrashAlt}
                    onClick={() => openDeleteDialog(brand)}
                  />
                </Flex>
              ),
            },
          ]}
          value={brands}
          emptyMessage="No brands found."
        />
      </Flex>

      <BrandDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        onSuccess={handleSuccess}
        brand={editingBrand}
      />

      <ConfirmDialog
        visible={confirmDialogVisible}
        onCancel={() => setConfirmDialogVisible(false)}
        onConfirm={handleDelete}
        title="Delete Brand"
        message={`Are you sure you want to delete "${brandToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </AdminLayout>
  );
};

export default BrandsPage;
