import React, { useEffect } from 'react';
import {
  Dialog,
  StringInput,
  TextArea,
  Button,
  useToast,
  TabBar,
  TabBarItem,
  Divider,
} from '@baby-toys/ui-kit';
import type { Material } from '../../api/types/material';
import { Flex } from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { materialSchema, type MaterialFormValues, defaultMaterialValues } from './materials.helper';
import { useCreateMaterial, useUpdateMaterial, useMaterialAdmin } from '../../api/materialApi';
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
  const { data: adminMaterial } = useMaterialAdmin(material?.id);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: defaultMaterialValues,
  });

  // Reset form when dialog opens or material changes
  useEffect(() => {
    if (material?.id && adminMaterial) {
      const trMap = new Map<string, any>();
      adminMaterial.translations?.forEach(
        (t) => t?.locale && trMap.set(String(t.locale).toLowerCase(), t)
      );
      const en = trMap.get('en') || {};
      const ar = trMap.get('ar') || {};
      reset({
        translations: {
          en: { name: en.name || '', description: en.description || '' },
          ar: { name: ar.name || '', description: ar.description || '' },
        },
      });
    } else if (!material?.id) {
      reset(defaultMaterialValues);
    }
  }, [material?.id, adminMaterial, reset, visible]);

  const onSubmit = async (data: MaterialFormValues) => {
    try {
      const payload = {
        translations: [
          {
            locale: 'en',
            name: data.translations.en.name,
            description: data.translations.en.description || '',
          },
          {
            locale: 'ar',
            name: data.translations.ar.name,
            description: data.translations.ar.description || '',
          },
        ],
        isActive: true,
      };

      if (material?.id) {
        await updateMutation.mutateAsync({ id: material.id, ...payload });
        toast.success('Material updated successfully');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Material created successfully');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while saving the material');
    }
  };

  const footer = (
    <Button
      onClick={handleSubmit(onSubmit)}
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
      <Flex direction="vertical" spacing="m" fullWidth>
        <TabBar
          size="small"
          fullWidth
          tabs={[
            { header: 'English (en)', value: 'en' },
            { header: 'Arabic (ar)', value: 'ar' },
          ]}
          defaultSelected="en"
        >
          <TabBarItem value="en">
            <FormFieldWrapper
              name={`translations.en.name`}
              control={control}
              label="Name (en)"
              required
              fullWidth
            >
              <StringInput isDisabled={isSubmitting} />
            </FormFieldWrapper>
            <FormFieldWrapper
              name={`translations.en.description`}
              control={control}
              label="Description (en)"
              fullWidth
              className="bts-marginTm"
            >
              <TextArea rows={4} isDisabled={isSubmitting} />
            </FormFieldWrapper>
          </TabBarItem>
          <Divider thickness="2px" />
          <TabBarItem value="ar">
            <FormFieldWrapper
              name={`translations.ar.name`}
              control={control}
              label="Name (ar)"
              required
              fullWidth
            >
              <StringInput isDisabled={isSubmitting} />
            </FormFieldWrapper>
            <FormFieldWrapper
              name={`translations.ar.description`}
              control={control}
              label="Description (ar)"
              fullWidth
              className="bts-marginTm"
            >
              <TextArea rows={4} isDisabled={isSubmitting} />
            </FormFieldWrapper>
          </TabBarItem>
        </TabBar>
      </Flex>
    </Dialog>
  );
};

export default MaterialDialog;
