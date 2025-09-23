import React, { useEffect } from 'react';
import {
  Dialog,
  StringInput,
  Button,
  Flex,
  ColorPicker,
  useToast,
} from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Color } from '../../api/types/color';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { useCreateColor, useUpdateColor } from '../../api/colorApi';

const colorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color code'),
});

type ColorFormValues = z.infer<typeof colorSchema>;

interface ColorDialogProps {
  visible: boolean;
  onHide: () => void;
  onSuccess: () => void;
  color?: Color | null;
}

const ColorDialog: React.FC<ColorDialogProps> = ({ visible, onHide, onSuccess, color }) => {
  const toast = useToast();
  const createColor = useCreateColor();
  const updateColor = useUpdateColor();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
  } = useForm<ColorFormValues>({
    resolver: zodResolver(colorSchema),
    defaultValues: { name: '', code: '#000000' },
  });

  useEffect(() => {
    if (color) {
      reset({ name: color.name || '', code: color.code || '#000000' });
    } else {
      reset({ name: '', code: '#000000' });
    }
  }, [color, reset]);

  const onSubmit = async (data: ColorFormValues) => {
    try {
      if (color) {
        await updateColor.mutateAsync({ id: color.id, data });
        toast.success('Color updated successfully');
      } else {
        await createColor.mutateAsync(data);
        toast.success('Color created successfully');
      }
      onSuccess();
      onHide();
      reset();
    } catch {
      toast.error(`Failed to ${color ? 'update' : 'create'} color`);
    }
  };

  const footer = (
    <Button
      onClick={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      isDisabled={isSubmitting || !isValid}
      fullWidth
    >
      {color ? 'Update' : 'Create'}
    </Button>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={color ? 'Edit Color' : 'Add New Color'}
      footer={footer}
    >
      <Flex direction="vertical" spacing="m" fullwidth>
        <FormFieldWrapper name="name" control={control} label="Color Name" required fullWidth>
          <StringInput placeholder="Enter color name" isDisabled={isSubmitting} />
        </FormFieldWrapper>

        <FormFieldWrapper name="code" control={control} label="Color Code" required fullWidth>
          <ColorPicker isDisabled={isSubmitting} />
        </FormFieldWrapper>
      </Flex>
    </Dialog>
  );
};

export default ColorDialog;
