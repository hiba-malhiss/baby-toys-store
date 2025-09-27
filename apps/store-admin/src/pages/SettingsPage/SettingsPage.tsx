import React, { useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Card,
  Flex,
  Heading,
  Button,
  useToast,
  StringInput,
  TextArea,
  Accordion,
  AccordionGroup,
} from '@baby-toys/ui-kit';
import {
  useStoreSettings,
  useUpsertStoreSettings,
  type StoreSettingUpdateItem,
} from '../../api/settingsApi';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';

const generalSchema = z.object({
  currency: z.string().min(1, 'Currency is required').max(10),
  currencySymbol: z.string().min(1, 'Currency symbol is required').max(5),
  timezone: z.string().min(1, 'Timezone is required').max(100),
});

const contactSchema = z.object({
  workDays: z.string().min(1, 'Working days are required').max(100),
  workTimes: z.string().min(1, 'Working times are required').max(100),
  phone: z.string().min(1, 'Phone is required').max(50),
  email: z.string().email('Invalid email').max(100),
  address: z.string().min(1, 'Address is required').max(500),
});

const policiesSchema = z.object({
  cancelPolicy: z.string().max(4000).optional().default(''),
  returnPolicy: z.string().max(8000).optional().default(''),
  shippingPolicy: z.string().max(8000).optional().default(''),
});

const settingsSchema = z.object({
  general: generalSchema,
  contact: contactSchema,
  policies: policiesSchema,
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const SettingsPage: React.FC = () => {
  const toast = useToast();
  const { data } = useStoreSettings();
  const upsertMutation = useUpsertStoreSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      general: { currency: '', currencySymbol: '', timezone: '' },
      contact: { workDays: '', workTimes: '', phone: '', email: '', address: '' },
      policies: { cancelPolicy: '', returnPolicy: '', shippingPolicy: '' },
    },
    mode: 'onBlur',
  });

  const { control, handleSubmit, reset, formState } = form;

  useEffect(() => {
    if (!data) return;
    reset({
      general: {
        currency: data.general?.currency ?? '',
        currencySymbol: data.general?.currencySymbol ?? '',
        timezone: data.general?.timezone ?? '',
      },
      contact: {
        workDays: data.contact?.workDays ?? '',
        workTimes: data.contact?.workTimes ?? '',
        phone: data.contact?.phone ?? '',
        email: data.contact?.email ?? '',
        address: data.contact?.address ?? '',
      },
      policies: {
        cancelPolicy: data.policies?.cancelPolicy ?? '',
        returnPolicy: data.policies?.returnPolicy ?? '',
        shippingPolicy: data.policies?.shippingPolicy ?? '',
      },
    });
  }, [data, reset]);

  const onSubmit = async (values: SettingsFormValues) => {
    const payload: StoreSettingUpdateItem[] = [
      // General
      { section: 'GENERAL', key: 'currency', value: values.general.currency },
      { section: 'GENERAL', key: 'currencySymbol', value: values.general.currencySymbol },
      { section: 'GENERAL', key: 'timezone', value: values.general.timezone },
      // Contact
      { section: 'CONTACT', key: 'workDays', value: values.contact.workDays },
      { section: 'CONTACT', key: 'workTimes', value: values.contact.workTimes },
      { section: 'CONTACT', key: 'phone', value: values.contact.phone },
      { section: 'CONTACT', key: 'email', value: values.contact.email },
      { section: 'CONTACT', key: 'address', value: values.contact.address },
      // Policies
      { section: 'POLICIES', key: 'cancelPolicy', value: values.policies.cancelPolicy || '' },
      { section: 'POLICIES', key: 'returnPolicy', value: values.policies.returnPolicy || '' },
      { section: 'POLICIES', key: 'shippingPolicy', value: values.policies.shippingPolicy || '' },
    ];

    try {
      await upsertMutation.mutateAsync(payload);
      toast.success('Store settings updated');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to update settings');
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card fullWidth>
          <Flex direction="column" spacing="xxl" fullWidth>
            <Heading>Store Settings</Heading>

            {/* General Section */}
            <Accordion header="General" buttonAppearance="outline">
              <Flex direction="vertical" spacing="m" fullWidth>
                <FormFieldWrapper
                  control={control}
                  name="general.currency"
                  label="Currency"
                  fullWidth
                  required
                >
                  <StringInput placeholder="USD" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="general.currencySymbol"
                  label="Currency Symbol"
                  fullWidth
                  required
                >
                  <StringInput placeholder="$" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="general.timezone"
                  label="Timezone"
                  fullWidth
                  required
                >
                  <StringInput placeholder="Asia/Gaza" />
                </FormFieldWrapper>
              </Flex>
            </Accordion>

            {/* Contact Section */}
            <Accordion header="Contact" buttonAppearance="outline">
              <Flex direction="vertical" spacing="m" fullWidth>
                <FormFieldWrapper
                  control={control}
                  name="contact.workDays"
                  label="Working Days"
                  fullWidth
                  required
                >
                  <StringInput placeholder="Monday to Friday" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="contact.workTimes"
                  label="Working Times"
                  fullWidth
                  required
                >
                  <StringInput placeholder="10am - 6pm (Palestine time)" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="contact.phone"
                  label="Phone"
                  fullWidth
                  required
                >
                  <StringInput placeholder="+1 234 567 8900" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="contact.email"
                  label="Email"
                  fullWidth
                  required
                >
                  <StringInput placeholder="support@toystore.com" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="contact.address"
                  label="Address"
                  fullWidth
                  required
                >
                  <TextArea rows={3} placeholder="123 Toy Lane, Playtown, USA" />
                </FormFieldWrapper>
              </Flex>
            </Accordion>

            {/* Policies Section */}
            <Accordion header="Policies" buttonAppearance="outline">
              <Flex direction="vertical" spacing="m" fullWidth>
                <FormFieldWrapper
                  control={control}
                  name="policies.cancelPolicy"
                  label="Cancel Policy"
                  fullWidth
                >
                  <TextArea rows={4} placeholder="Describe cancellation policy" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="policies.returnPolicy"
                  label="Return Policy"
                  fullWidth
                >
                  <TextArea rows={4} placeholder="Describe return policy" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="policies.shippingPolicy"
                  label="Shipping Policy"
                  fullWidth
                >
                  <TextArea rows={4} placeholder="Describe shipping policy" />
                </FormFieldWrapper>
              </Flex>
            </Accordion>

            <Flex justify="end">
              <Button
                type="submit"
                isLoading={upsertMutation.isPending}
                isDisabled={formState.isSubmitting}
              >
                Save Settings
              </Button>
            </Flex>
          </Flex>
        </Card>
      </form>
    </AdminLayout>
  );
};

export default SettingsPage;
