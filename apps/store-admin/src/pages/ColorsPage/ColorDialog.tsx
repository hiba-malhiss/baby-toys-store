import React, { useEffect, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

const getColorSchema = (t: TFunction) =>
  z.object({
    code: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, t('colors.invalidCode')),
    translations: z.object({
      en: z.object({ name: z.string().min(1, t('colors.nameRequired', { locale: 'en' })) }),
      ar: z.object({ name: z.string().min(1, t('colors.nameRequired', { locale: 'ar' })) }),
    }),
  });

type ColorFormValues = z.infer<ReturnType<typeof getColorSchema>>;

interface ColorDialogProps {
  visible: boolean;
  onHide: () => void;
  onSuccess: () => void;
  color?: Color | null;
}

const ColorDialog: React.FC<ColorDialogProps> = ({ visible, onHide, onSuccess, color }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const createColor = useCreateColor();
  const updateColor = useUpdateColor();
  const { data: adminColor } = useColorAdmin(color?.id);
  const colorSchema = useMemo(() => getColorSchema(t), [t]);

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
        toast.success(t('colors.updateSuccess'));
      } else {
        await createColor.mutateAsync(payload);
        toast.success(t('colors.createSuccess'));
      }
      onSuccess();
      onHide();
      reset();
    } catch (e: any) {
      toast.error(e?.message || (color ? t('colors.updateError') : t('colors.createError')));
    }
  };

  const footer = (
    <Button
      onClick={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      isDisabled={isSubmitting || !isValid}
      fullWidth
    >
      {color ? t('colors.update') : t('colors.create')}
    </Button>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={color ? t('colors.editTitle') : t('colors.addTitle')}
      footer={footer}
    >
      <Flex direction="vertical" spacing="m" fullWidth>
        <TabBar
          fullWidth
          size="small"
          tabs={[
            { header: t('colors.tabs.en'), value: 'en' },
            { header: t('colors.tabs.ar'), value: 'ar' },
          ]}
          defaultSelected="en"
        >
          <TabBarItem value="en">
            <FormFieldWrapper
              name={`translations.en.name`}
              control={control}
              label={t('colors.fields.name', { locale: 'en' })}
              required
              fullWidth
            >
              <StringInput placeholder={t('colors.placeholders.name')} isDisabled={isSubmitting} />
            </FormFieldWrapper>
          </TabBarItem>
          <TabBarItem value="ar">
            <FormFieldWrapper
              name={`translations.ar.name`}
              control={control}
              label={t('colors.fields.name', { locale: 'ar' })}
              required
              fullWidth
            >
              <StringInput placeholder={t('colors.placeholders.name')} isDisabled={isSubmitting} />
            </FormFieldWrapper>
          </TabBarItem>
        </TabBar>
        <Divider thickness="2px" />

        <FormFieldWrapper
          name="code"
          control={control}
          label={t('colors.fields.code')}
          required
          fullWidth
        >
          <ColorPicker isDisabled={isSubmitting} />
        </FormFieldWrapper>
      </Flex>
    </Dialog>
  );
};

export default ColorDialog;
