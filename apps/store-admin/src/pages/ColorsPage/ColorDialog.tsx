import React, { useEffect } from 'react';
import {
  Dialog,
  StringInput,
  Button,
  Flex,
  ColorPicker,
  useToast,
  TabBar,
  TabBarItem,
  Divider,
} from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Color } from '../../api/types/color';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { useCreateColor, useUpdateColor, useColorAdmin } from '../../api/colorApi';

const colorSchema = z.object({
  code: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color code'),
  translations: z.object({
    en: z.object({ name: z.string().min(1, 'Name (en) is required') }),
    ar: z.object({ name: z.string().min(1, 'Name (ar) is required') }),
  }),
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
  const { data: adminColor } = useColorAdmin(color?.id);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
  } = useForm<ColorFormValues>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      code: '#000000',
      translations: { en: { name: '' }, ar: { name: '' } },
    },
  });

  useEffect(() => {
    if (color?.id && adminColor) {
      const trMap = new Map<string, any>();
      adminColor.translations?.forEach(
        (t) => t?.locale && trMap.set(String(t.locale).toLowerCase(), t)
      );
      const en = trMap.get('en') || {};
      const ar = trMap.get('ar') || {};
      reset({
        code: adminColor.code || '#000000',
        translations: {
          en: { name: en.name || '' },
          ar: { name: ar.name || '' },
        },
      });
    } else if (!color?.id) {
      reset({ code: '#000000', translations: { en: { name: '' }, ar: { name: '' } } });
    }
  }, [color?.id, adminColor, reset]);

  const onSubmit = async (data: ColorFormValues) => {
    try {
      const payload = {
        code: data.code,
        translations: [
          { locale: 'en', name: data.translations.en.name },
          { locale: 'ar', name: data.translations.ar.name },
        ],
      };
      if (color?.id) {
        await updateColor.mutateAsync({ id: color.id, payload });
        toast.success('Color updated successfully');
      } else {
        await createColor.mutateAsync(payload);
        toast.success('Color created successfully');
      }
      onSuccess();
      onHide();
      reset();
    } catch (e: any) {
      toast.error(e?.message || `Failed to ${color ? 'update' : 'create'} color`);
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
      <Flex direction="vertical" spacing="m" fullWidth>
        <TabBar
          fullWidth
          size="small"
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
              label="Color Name (en)"
              required
              fullWidth
            >
              <StringInput placeholder="Enter color name" isDisabled={isSubmitting} />
            </FormFieldWrapper>
          </TabBarItem>
          <TabBarItem value="ar">
            <FormFieldWrapper
              name={`translations.ar.name`}
              control={control}
              label="Color Name (ar)"
              required
              fullWidth
            >
              <StringInput placeholder="Enter color name" isDisabled={isSubmitting} />
            </FormFieldWrapper>
          </TabBarItem>
        </TabBar>
        <Divider thickness="2px" />

        <FormFieldWrapper name="code" control={control} label="Color Code" required fullWidth>
          <ColorPicker isDisabled={isSubmitting} />
        </FormFieldWrapper>
      </Flex>
    </Dialog>
  );
};

export default ColorDialog;
