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
} from '@baby-toys/ui-kit';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import useBrands from './useBrands';
import BrandDialog from './BrandDialog';
import { Brand } from '../../api/types/brand.ts';
import { useTranslation } from 'react-i18next';

const BrandsPage: React.FC = () => {
  const { t } = useTranslation();
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
          title={t('brands.loadErrorTitle')}
          message={error.message || t('app.unexpectedError')}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" fullWidth>
          <Heading>{t('brands.title')}</Heading>
          <Button onClick={openAddDialog}>{t('brands.add')}</Button>
        </Flex>

        <Table
          stripedRows
          columns={[
            {
              header: t('brands.columns.logo'),
              field: 'logoUrl',
              type: 'image',
            },
            {
              header: t('brands.columns.name'),
              field: 'name',
            },
            {
              header: t('brands.columns.description'),
              field: 'description',
            },
            {
              header: t('app.actions'),
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
          emptyMessage={t('brands.empty')}
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
        header={t('brands.deleteTitle')}
        message={t('brands.deleteConfirm', { name: brandToDelete?.name })}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
      />
    </AdminLayout>
  );
};

export default BrandsPage;
