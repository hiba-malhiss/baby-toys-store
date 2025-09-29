import React, { useEffect } from 'react';
import { Button, Dialog, Flex, StringInput, Select, useToast } from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateShippingOption, useUpdateShippingOption, type ShippingOption } from '../../api/shippingOptionApi';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(255).optional().or(z.literal('')),
  cost: z
    .string()
    .regex(/^(?:\d+)(?:\.\d+)?$/, 'Enter a valid number')
    .default('0'),
  active: z.enum(['yes', 'no']).default('yes'),
});

export type ShippingOptionForm = z.infer<typeof schema>;

const ShippingOptionDialog: React.FC<{
  visible: boolean;
  option?: ShippingOption | null;
  onHide: () => void;
  onSuccess?: () => void;
}> = ({ visible, option, onHide, onSuccess }) => {
  const toast = useToast();
  const createMutation = useCreateShippingOption();
  const updateMutation = useUpdateShippingOption();

  const { control, handleSubmit, reset, formState } = useForm<ShippingOptionForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', cost: '0', active: 'yes' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!visible) return;
    if (option) {
      reset({
        name: option.name,
        description: option.description ?? '',
        cost: String(option.cost ?? 0),
        active: option.active ? 'yes' : 'no',
      });
    } else {
      reset({ name: '', description: '', cost: '0', active: 'yes' });
    }
  }, [option, reset, visible]);

  const onSubmit = async (values: ShippingOptionForm) => {
    try {
      if (option) {
        await updateMutation.mutateAsync({
          id: option.id,
          data: {
            name: values.name,
            description: values.description || '',
            cost: Number(values.cost || 0),
            active: values.active === 'yes',
          },
        });
        toast.success('Shipping option updated');
      } else {
        await createMutation.mutateAsync({
          name: values.name,
          description: values.description || '',
          cost: Number(values.cost || 0),
          active: values.active === 'yes',
        });
        toast.success('Shipping option created');
      }
      onSuccess?.();
      onHide();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to save shipping option');
    }
  };

  return (
    <Dialog visible={visible} onHide={onHide} header={option ? 'Edit Shipping Option' : 'Add Shipping Option'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="vertical" spacing="m" fullWidth>
          <FormFieldWrapper control={control} name="name" label="Name" fullWidth required>
            <StringInput placeholder="e.g. Standard" />
          </FormFieldWrapper>
          <FormFieldWrapper control={control} name="description" label="Description" fullWidth>
            <StringInput placeholder="Optional" />
          </FormFieldWrapper>
          <FormFieldWrapper control={control} name="cost" label="Cost" fullWidth required>
            <StringInput placeholder="0" />
          </FormFieldWrapper>
          <FormFieldWrapper control={control} name="active" label="Status" fullWidth>
            <Select
              options={[
                { label: 'Active', value: 'yes' },
                { label: 'Inactive', value: 'no' },
              ]}
              placeholder="Select status"
            />
          </FormFieldWrapper>
          <Flex justify="end" spacing="m">
            <Button appearance="outline" type="button" onClick={onHide}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending} isDisabled={!formState.isValid}>
              Save
            </Button>
          </Flex>
        </Flex>
      </form>
    </Dialog>
  );
};

export default ShippingOptionDialog;
