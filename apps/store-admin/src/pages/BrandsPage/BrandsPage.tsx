import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useMockAdminApi } from '@mock-data/useMockApi';
import {
  Button,
  Flex,
  Table,
  Heading,
  ConfirmDialog,
  useToast,
  StringInput,
  Dialog,
  ImageUploader,
  FieldWrapper,
  TextArea,
} from '@baby-toys/ui-kit/components';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { Brand } from '@baby-toys/types';

const BrandsPage: React.FC = () => {
  const { getBrands, addBrand, updateBrand, deleteBrand } = useMockAdminApi();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const toast = useToast();

  const fetchBrands = useCallback(async () => {
    const data = await getBrands();
    setBrands(data);
  }, [getBrands]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const openAddDialog = () => {
    setEditingBrand(null);
    setLogoFile(null);
    setDialogVisible(true);
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    setLogoFile(null);
    setDialogVisible(true);
  };

  const handleSaveBrand = async () => {
    try {
      if (editingBrand?.id) {
        await updateBrand({
          ...editingBrand,
          logo: logoFile ? URL.createObjectURL(logoFile) : editingBrand.logo,
        });
        toast.success('Brand updated successfully');
      } else if (editingBrand) {
        await addBrand({
          ...editingBrand,
          id: Date.now().toString(),
          logo: logoFile ? URL.createObjectURL(logoFile) : '',
        });
        toast.success('Brand added successfully');
      }
      setDialogVisible(false);
      fetchBrands();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save brand');
    }
  };

  const openConfirmDialog = (brand: Brand) => {
    setBrandToDelete(brand);
    setConfirmDialogVisible(true);
  };

  const handleDelete = async () => {
    if (brandToDelete) {
      try {
        await deleteBrand(brandToDelete.id);
        setConfirmDialogVisible(false);
        toast.success('Brand deleted successfully');
        fetchBrands();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete brand');
      }
    }
  };

  const columns = [
    { field: 'name', header: 'Name' },
    {
      field: 'logo',
      header: 'Logo',
      body: (row: Brand) =>
        row.logo ? (
          <img src={row.logo} alt={row.name} style={{ height: 50, objectFit: 'contain' }} />
        ) : null,
    },
    { field: 'description', header: 'Description' },
    { field: 'website', header: 'Website' },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: Brand) => (
        <Flex spacing="m">
          <Button
            size="small"
            leftIcon={faPen}
            appearance="outline"
            onClick={() => openEditDialog(row)}
          />
          <Button
            size="small"
            appearance="outline"
            leftIcon={faTrashAlt}
            onClick={() => openConfirmDialog(row)}
          />
        </Flex>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" fullWidth>
          <Heading>Brands</Heading>
          <Button onClick={openAddDialog}>Add Brand</Button>
        </Flex>
        <Table value={brands} columns={columns} />
      </Flex>

      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={editingBrand?.id ? 'Edit Brand' : 'Add Brand'}
      >
        <Flex direction="vertical" spacing="m" align="end">
          <FieldWrapper label="Brand name" fullWidth>
            <StringInput
              fullWidth
              value={editingBrand?.name || ''}
              onChange={(v) => setEditingBrand((prev) => ({ ...(prev || {}), name: v }))}
              placeholder="Brand name"
            />
          </FieldWrapper>
          <FieldWrapper label="Website" fullWidth>
            <StringInput
              fullWidth
              value={editingBrand?.website || ''}
              onChange={(v) =>
                setEditingBrand((prev) => ({
                  ...(prev || {}),
                  website: v,
                }))
              }
              placeholder="https://example.com"
            />
          </FieldWrapper>
          <FieldWrapper label="Brand description" fullWidth>
            <TextArea
              fullWidth
              value={editingBrand?.description || ''}
              onChange={(v) =>
                setEditingBrand((prev) => ({
                  ...(prev || {}),
                  description: v,
                }))
              }
              placeholder="Add a description..."
            />
          </FieldWrapper>
          <FieldWrapper label="Logo" fullWidth>
            <ImageUploader
              existingImages={editingBrand?.logo ? [editingBrand.logo] : []}
              onImagesChange={(files) => setLogoFile(files[0] || null)}
              multiple={false}
            />
          </FieldWrapper>
          <Button onClick={handleSaveBrand} isDisabled={!editingBrand?.name}>
            {editingBrand?.id ? 'Update' : 'Add'} Brand
          </Button>
        </Flex>
      </Dialog>

      <ConfirmDialog
        visible={confirmDialogVisible}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialogVisible(false)}
        message={`Are you sure you want to delete "${brandToDelete?.name}" brand?`}
        header="Confirmation"
        danger
      />
    </AdminLayout>
  );
};

export default BrandsPage;
