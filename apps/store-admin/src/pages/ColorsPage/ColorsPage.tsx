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
  FieldWrapper,
  ColorPicker,
} from '@baby-toys/ui-kit/components';
import { faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Color } from '@baby-toys/types/src';

const ColorsPage: React.FC = () => {
  const { getColors, addColor, deleteColor, updateColor } = useMockAdminApi();
  const [colors, setColors] = useState<Color[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);
  const toast = useToast();

  const fetchColors = useCallback(async () => {
    const data = await getColors();
    setColors(data);
  }, [getColors]);

  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const openAddDialog = () => {
    setEditingColor(null);
    setDialogVisible(true);
  };

  const openEditDialog = (color: Color) => {
    setEditingColor(color);
    setDialogVisible(true);
  };

  const handleSaveColor = async () => {
    try {
      if (editingColor?.id) {
        await updateColor(editingColor);
        toast.success('Color updated successfully');
      } else {
        await addColor({ 
          name: editingColor?.name || '', 
          code: editingColor?.code || '#000000' 
        });
        toast.success('Color added successfully');
      }
      setDialogVisible(false);
      // Refetch colors to ensure we have the latest data
      await fetchColors();
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const openConfirmDialog = (color: Color) => {
    setColorToDelete(color);
    setConfirmDialogVisible(true);
  };

  const handleDelete = async () => {
    if (colorToDelete) {
      try {
        await deleteColor(colorToDelete.id);
        setConfirmDialogVisible(false);
        toast.success('Color deleted successfully');
        // Refetch colors to ensure we have the latest data
        await fetchColors();
      } catch (error) {
        toast.error(error.message || 'Failed to delete color');
      }
    }
  };

  const columns = [
    { field: 'name', header: 'Name' },
    {
      field: 'color',
      header: 'Color',
      body: (row: Color) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: row.code,
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          <span>{row.code}</span>
        </div>
      ),
    },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: Color) => (
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
          <Heading>Colors</Heading>
          <Button onClick={openAddDialog}>Add Color</Button>
        </Flex>
        <Table value={colors} columns={columns} />
      </Flex>
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={editingColor ? 'Edit Color' : 'Add Color'}
      >
        <Flex direction="vertical" spacing="m" align="end">
          <FieldWrapper label="Color name" fullWidth>
            <StringInput
              fullWidth
              value={editingColor?.name || ''}
              onChange={(v) => setEditingColor((prev: any) => ({ ...prev, name: v }))}
              placeholder="Color name"
            />
          </FieldWrapper>
          <FieldWrapper label="Color value" fullWidth>
            <ColorPicker
              value={editingColor?.code || '#000000'}
              onChange={(hex) => setEditingColor((prev: any) => ({ ...prev, code: hex }))}
            />
          </FieldWrapper>
          <Button onClick={handleSaveColor} isDisabled={!editingColor?.name || !editingColor?.code}>
            {editingColor?.id ? 'Update' : 'Add'}
          </Button>
        </Flex>
      </Dialog>
      <ConfirmDialog
        visible={confirmDialogVisible}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialogVisible(false)}
        message={`Are you sure you want to delete "${colorToDelete?.name}" color?`}
        header="Confirmation"
        danger
      />
    </AdminLayout>
  );
};

export default ColorsPage;
