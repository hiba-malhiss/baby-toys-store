import React, { useEffect } from 'react';
import { Dialog, StringInput, TextArea, Button, useToast } from '@baby-toys/ui-kit/components';
import { Material } from '@baby-toys/types/src';
import { Flex } from '@baby-toys/ui-kit/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { materialSchema, MaterialFormValues } from './materials.helper';
import { useCreateMaterial, useUpdateMaterial } from '../../api/materialApi';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';

type MaterialDialogProps = {
  visible: boolean;
  onClose: () => void;
  material: Material | null;
};

const MaterialDialog: React.FC<MaterialDialogProps> = ({ visible, onClose, material }) => {
  const toast = useToast();
  const createMutation = useCreateMaterial();
  const updateMutation = useUpdateMaterial();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: material?.name || '',
      description: material?.description || '',
    },
  });

  // Reset form when dialog opens or material changes
  useEffect(() => {
    reset({
      name: material?.name || '',
      description: material?.description || '',
    });
  }, [material, reset, visible]);

  const onSubmit = async (data: MaterialFormValues) => {
    try {
      if (material?.id) {
        await updateMutation.mutateAsync({ id: material.id, ...data });
        toast.success('Material updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Material created successfully');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while saving the material');
    }
  };

  const footer = (
    <Button
      type="submit"
      form="material-form"
      isLoading={isSubmitting}
      isDisabled={isSubmitting || !isValid}
      fullWidth
    >
      {material ? 'Update' : 'Create'}
    </Button>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onClose}
      header={material ? 'Edit Material' : 'Add New Material'}
      footer={footer}
    >
      <form id="material-form" onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="vertical" spacing="m" fullwidth>
          <FormFieldWrapper name="name" control={control} label="Name" required fullWidth>
            <StringInput disabled={isSubmitting} />
          </FormFieldWrapper>
          <FormFieldWrapper name="description" control={control} label="Description" fullWidth>
            <TextArea rows={4} disabled={isSubmitting} />
          </FormFieldWrapper>
        </Flex>
      </form>
    </Dialog>
  );
};

export default MaterialDialog;
