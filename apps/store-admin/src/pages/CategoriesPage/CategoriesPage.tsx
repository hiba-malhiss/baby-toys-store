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
  FileUpload,
  FieldWrapper,
  TextArea,
} from '@baby-toys/ui-kit/components';
import { faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Category } from '@baby-toys/types/src';

const CategoriesPage: React.FC = () => {
  const { getCategories, addCategory, deleteCategory, updateCategory } = useMockAdminApi();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category>(null);
  const [editingCategoryImage, setEditingCategoryImage] = useState<File | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const toast = useToast();

  const fetchCategories = useCallback(async () => {
    const data = await getCategories();
    setCategories(data);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAddDialog = () => {
    setEditingCategory(null);
    setEditingCategoryImage(null);
    setDialogVisible(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setEditingCategoryImage(category.image || null);
    setDialogVisible(true);
  };

  const handleSaveCategory = async () => {
    if (editingCategory?.id) {
      await updateCategory({ ...editingCategory, image: editingCategoryImage });
      toast.success('Category updated successfully');
    } else {
      await addCategory({ name: editingCategory?.name || '', image: editingCategoryImage });
      toast.success('Category added successfully');
    }
    setDialogVisible(false);
    fetchCategories();
  };

  const openConfirmDialog = (category: Category) => {
    setCategoryToDelete(category);
    setConfirmDialogVisible(true);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete.id);
      setConfirmDialogVisible(false);
      toast.success('Category deleted successfully');
      fetchCategories();
    }
  };

  const columns = [
    { field: 'name', header: 'Name' },
    {
      field: 'image',
      header: 'Image',
      body: (row: Category) => (
        <img src={row.image} alt={row.name} style={{ height: 50, objectFit: 'cover' }} />
      ),
    },
    { field: 'description', header: 'Description' },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: Category) => (
        <Flex spacing="m">
          <Button
            size="small"
            leftIcon={faPencil}
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
      <Flex direction="vertical" spacing="xxl" fullWidth>
        <Flex justify="between" fullWidth>
          <Heading>Categories</Heading>
          <Button onClick={openAddDialog}>Add Category</Button>
        </Flex>
        <Table value={categories} columns={columns} />
      </Flex>
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <Flex direction="vertical" spacing="m" align="end">
          <FieldWrapper label="Category name" fullWidth>
            <StringInput
              fullWidth
              value={editingCategory?.name}
              onChange={(v) => setEditingCategory((prev: any) => ({ ...prev, name: v }))}
              placeholder="Category name"
            />
          </FieldWrapper>
          <FieldWrapper label="Category description" fullWidth>
            <TextArea
              fullWidth
              value={editingCategory?.description}
              onChange={(v) => setEditingCategory((prev: any) => ({ ...prev, description: v }))}
              placeholder="Add a description..."
            />
          </FieldWrapper>
          <FieldWrapper label="Category icon" fullWidth>
            <FileUpload
              fullWidth
              images={editingCategoryImage ? [editingCategoryImage] : []}
              onImagesChange={(files) => setEditingCategoryImage(files[0] || null)}
              mainImage={null}
              onMainImageChange={() => {}}
            />
          </FieldWrapper>
          <Button onClick={handleSaveCategory} isDisabled={!editingCategory?.name}>
            {editingCategory?.id ? 'Update' : 'Add'}
          </Button>
        </Flex>
      </Dialog>
      <ConfirmDialog
        visible={confirmDialogVisible}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialogVisible(false)}
        message={`Are you sure you want to delete "${categoryToDelete?.name}" category?`}
        header="Confirmation"
        danger
      />
    </AdminLayout>
  );
};

export default CategoriesPage;
